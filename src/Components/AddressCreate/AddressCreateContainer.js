import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  HANDLE_SUBMIT,
  SHOW_ALERT,
  LOADING,
  VALIDATE_FIELD,
  SET_TEXT_FIELD,
  HANDLE_CHECKBOX_CHANGE,
  RESET_FIELD_ERROR,
  GET_COUNTRIES_SUCCESS,
  GET_STATES_SUCCESS,
  GET_COUNTRIES_FETCH,
  GET_STATES_FETCH
} from "../../utils/action-types";
import { sortCountries } from "../../utils/utils";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
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
  isStateLoading: false,
  country: "",
  countryError: "",
  isCountryLoading: false,
  postalCode: "",
  postalCodeError: "",
  states: [],
  countries: [],
  isDefault: false,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const getNewlyCreatedAddress = (addresses) =>
  addresses[addresses.length - 1];

const AddressCreateContainer = ({
  style,
  className = "",
  type = "shipping",
  onGiftRedemptionSuccess = () => {},
  onMembershipAdressUpdateSuccess = () => {},
  onSuccess = () => {},
  onFailure = () => {},
  children,
  ...props
}) => {
  const { t } = useTranslation("address");
  const {
    giftCode: giftCodeFromStore,
    subscriptionIdToRenew: subscriptionIdToRenewFromStore,
    product,
    order,
    set,
    selectedMembership
  } = usePelcro();
  const giftCode = props.giftCode ?? giftCodeFromStore;
  const subscriptionIdToRenew =
    props.subscriptionIdToRenew ??
    subscriptionIdToRenewFromStore ??
    undefined;

  useEffect(() => {
    const getCountries = () => {
      dispatch({
        type: GET_COUNTRIES_FETCH
      });
      window.Pelcro.geolocation.getCountryList((error, response) => {
        if (error) {
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: error.message
            }
          });
        } else if (response) {
          dispatch({
            type: GET_COUNTRIES_SUCCESS,
            payload: sortCountries(response.countries)
          });
          preSelectUserCountry();
        }
      });
    };

    const preSelectUserCountry = () => {
      dispatch({
        type: SET_TEXT_FIELD,
        payload: { country: window.Pelcro.user.location.countryCode }
      });
    };

    getCountries();
  }, []);

  const submitAddress = (
    {
      firstName,
      lastName,
      line1,
      line2,
      city,
      state,
      country,
      postalCode,
      isDefault
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
        postal_code: postalCode,
        is_default: isDefault
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
          return dispatch({ type: LOADING, payload: false });
        }

        const newAddressId = String(
          getNewlyCreatedAddress(res.data.addresses).id
        );

        if (selectedMembership) {
          dispatch({ type: LOADING, payload: true });
          return window.Pelcro.membership.update(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              address_id: newAddressId,
              membership_id: selectedMembership.id
            },
            (err, res) => {
              dispatch({ type: LOADING, payload: false });

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
              notify.success(t("messages.addressUpdated"));
              return onMembershipAdressUpdateSuccess(res);
            }
          );
        }

        if (product || order) {
          set({ selectedAddressId: newAddressId });
        }

        if (!giftCode) {
          dispatch({ type: LOADING, payload: false });
          return onSuccess(newAddressId);
        }

        if (giftCode) {
          window.Pelcro.subscription.redeemGift(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              gift_code: giftCode,
              address_id: newAddressId,
              // redeem gift as a future phase of an existing subscription
              subscription_id: subscriptionIdToRenew
            },
            (err, res) => {
              dispatch({ type: LOADING, payload: false });

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

              return onGiftRedemptionSuccess(res);
            }
          );
        }
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case GET_COUNTRIES_FETCH:
          return Update({
            ...state,
            isCountryLoading: true
          });

        case GET_COUNTRIES_SUCCESS:
          return Update({
            ...state,
            countries: action.payload,
            isCountryLoading: false
          });

        case GET_STATES_FETCH:
          return Update({
            ...state,
            isStateLoading: true
          });

        case GET_STATES_SUCCESS: {
          const stateKeys = Object.keys(action.payload.states);

          return Update({
            ...state,
            states: action.payload,
            state: stateKeys?.[0],
            isStateLoading: false
          });
        }
        case SET_TEXT_FIELD:
          return Update({
            ...state,
            ...action.payload
          });

        case HANDLE_CHECKBOX_CHANGE:
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
            { ...state, isSubmitting: true },
            (state, dispatch) => submitAddress(state, dispatch)
          );
        default:
          return state;
      }
    },
    initialState
  );

  useEffect(() => {
    const getStates = () => {
      dispatch({
        type: GET_STATES_FETCH
      });
      window.Pelcro.geolocation.getStatesForCountry(
        state.country,
        (error, response) => {
          if (error) {
            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: error.message
              }
            });
          } else if (response) {
            dispatch({
              type: GET_STATES_SUCCESS,
              payload: response
            });
          }
        }
      );
    };

    if (state.country) {
      getStates();
    }
  }, [state.country]);

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-address-create-container ${className}`}
    >
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
