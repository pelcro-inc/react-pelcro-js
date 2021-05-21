import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  HANDLE_SUBMIT,
  GET_COUNTRIES_SUCCESS,
  GET_STATES_SUCCESS,
  SET_TEXT_FIELD,
  SHOW_ALERT,
  LOADING,
  VALIDATE_FIELD,
  RESET_FIELD_ERROR,
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
  isStateLoading: "",
  country: "",
  countryError: "",
  isCountryLoading: false,
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

const AddressUpdateContainer = ({
  style,
  className,
  type = "shipping",
  onSuccess = () => {},
  onFailure = () => {},
  children,
  ...props
}) => {
  const { addressIdToEdit } = usePelcro();
  const addressId = props?.addressId ?? addressIdToEdit;

  const [t] = useTranslation("address");
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
        }
      });
    };

    getAddressData();
    getCountries();
    window.Pelcro.insight.track("Modal Displayed", {
      name: "address"
    });
  }, []);

  const getAddressData = () => {
    const addresses = window.Pelcro.address.list();
    for (const address in addresses) {
      const thisAddress = addresses[address];

      if (+thisAddress.id === +addressId) {
        const newState = {
          ...initialState,
          firstName: thisAddress.first_name,
          lastName: thisAddress.last_name,
          line1: thisAddress.line1,
          line2: thisAddress.line2,
          city: thisAddress.city,
          state: thisAddress.state,
          country: thisAddress.country,
          postalCode: thisAddress.postal_code
        };
        dispatch({ type: SET_TEXT_FIELD, payload: newState });
      }
    }
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
    window.Pelcro.address.update(
      {
        address_id: addressId,
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
        dispatch({ type: LOADING, payload: false });
        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(err)
            }
          });
          onFailure(err);
        } else {
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "success",
              content: t("messages.addressUpdated")
            }
          });
          onSuccess();
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

        case GET_STATES_SUCCESS:
          return Update({
            ...state,
            states: action.payload,
            isStateLoading: false
          });

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

export { AddressUpdateContainer, store };
