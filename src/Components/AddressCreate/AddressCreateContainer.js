import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  DISABLE_SUBMIT,
  HANDLE_SUBMIT,
  SHOW_ALERT,
  LOADING,
  VALIDATE_FIELD,
  SET_TEXT_FIELD,
  RESET_FIELD_ERROR,
  SET_COUNTRIES,
  SET_STATES
} from "../../utils/action-types";
import { getUserLatestAddress } from "../../utils/utils";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  disableSubmit: false,
  isSubmitting: false,
  firstName: "",
  firstNameError: "",
  lastName: "",
  lastNameError: "",
  line1: "",
  line1Error: "",
  city: "",
  cityError: "",
  state: "",
  stateError: "",
  country: "",
  countryError: "",
  postalCode: "",
  postalCodeError: "",
  states: [],
  countries: [],
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const AddressCreateContainer = ({
  style,
  className,
  type = "shipping",
  giftCode = false,
  onGiftRedemptionSuccess = () => {},
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { t } = useTranslation("address");

  useEffect(() => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "address"
    });
  }, []);

  const enableSubmitButton = () => {
    dispatch({ type: DISABLE_SUBMIT, payload: false });
    dispatch({ type: LOADING, payload: false });
  };

  const submitAddress = (
    {
      firstName,
      lastName,
      line1,
      line2,
      city,
      state,
      country,
      postalCode
    },
    dispatch
  ) => {
    window.Pelcro.address.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        type: type,
        first_name: firstName,
        last_name: lastName,
        line1: line1,
        city: city,
        state: state,
        country: country,
        postal_code: postalCode
      },
      (err, res) => {
        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(err)
            }
          });
          onFailure(err);
          return enableSubmitButton();
        }

        if (giftCode) {
          const address = getUserLatestAddress();

          window.Pelcro.subscription.redeemGift(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              gift_code: giftCode,
              address_id: address?.id
            },
            (err, res) => {
              enableSubmitButton();

              if (err) {
                dispatch({
                  type: SHOW_ALERT,
                  payload: {
                    type: "error",
                    content: getErrorMessages(err)
                  }
                });
                return onFailure(err);
              }

              alert(t("messages.subRedeemed"));
              return onGiftRedemptionSuccess();
            }
          );
        }

        enableSubmitButton();
        return onSuccess();
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case DISABLE_SUBMIT:
          return Update({ ...state, disableSubmit: action.payload });

        case SET_COUNTRIES:
          return Update({ ...state, countries: action.payload });

        case SET_STATES:
          return Update({ ...state, states: action.payload });

        case SET_TEXT_FIELD:
          return Update({
            ...state,
            ...action.payload
          });

        case VALIDATE_FIELD:
          return Update({
            ...state,
            [`${action.payload}Error`]: state[action.payload]
              ? ""
              : t("labels.required")
          });

        case RESET_FIELD_ERROR:
          return Update({
            ...state,
            [action.payload]: ""
          });

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case LOADING:
          return Update({
            ...state,
            isSubmitting: action.payload
          });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true, isSubmitting: true },
            (state, dispatch) => submitAddress(state, dispatch)
          );
        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div style={{ ...style }} className={className}>
      <Provider value={{ state, dispatch }}>
        {children.length
          ? children.map((child, i) =>
              React.cloneElement(child, { store, key: i })
            )
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

export { AddressCreateContainer, store };
