import React, { createContext, useEffect } from "react";
import {
  SET_EMAIL,
  SET_PASSWORD,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
  SET_FIRST_NAME_ERROR,
  SET_LAST_NAME_ERROR,
  SET_PHONE_ERROR,
  SET_COMPANY_ERROR,
  SET_TITLE_ERROR,
  RESET_LOGIN_FORM,
  SET_CONFIRM_PASSWORD,
  CONFIRM_PASSWORD_USED,
  SET_CONFIRM_PASSWORD_ERROR,
  HANDLE_REGISTRATION,
  DISABLE_REGISTRATION_BUTTON,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_PHONE,
  SET_COMPANY,
  SET_TITLE,
  SET_TEXT_FIELD,
  SET_TEXT_FIELD_ERROR,
  SET_SELECT,
  SHOW_ALERT,
  HANDLE_SOCIAL_LOGIN
} from "../../utils/action-types";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
  SideEffect
} from "use-reducer-with-side-effects";
import { getErrorMessages } from "../common/Helpers";
import { cleanObjectNullValues } from "../../utils/utils";

const initialState = {
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  title: "",
  emailError: null,
  passwordError: null,
  confirmPassword: "",
  confirmPasswordError: null,
  confirmPasswordUsed: false,
  buttonDisabled: false,
  firstNameError: null,
  lastNameError: null,
  phoneError: null,
  companyError: null,
  titleError: null,
  selectFields: {},
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const RegisterContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  onDisplay = () => {},
  children
}) => {
  useEffect(() => {
    onDisplay();
  }, []);
  const handleRegister = (userData, dispatch) => {
    const filteredData = cleanObjectNullValues(userData);
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      company,
      title,
      selectFields
    } = filteredData;

    if (!hasSecurityTokenEnabled()) {
      sendRegisterRequest();
      return;
    }

    window.grecaptcha.enterprise.ready(async () => {
      const token = await window.grecaptcha.enterprise.execute(
        window.Pelcro.site.read()?.security_key,
        {
          action: "register"
        }
      );
      sendRegisterRequest(token);
    });

    function sendRegisterRequest(securityToken) {
      window.Pelcro.user.register(
        {
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          title: title,
          organization: company,
          security_token: securityToken,
          metadata: { ...selectFields }
        },
        (err, res) => {
          dispatch({
            type: DISABLE_REGISTRATION_BUTTON,
            payload: false
          });

          if (err) {
            let { registered_on_other_sites, ...errors } =
              err?.response?.data?.errors;
            err.response.data.errors = { ...errors };
            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
            onFailure(err);
          } else {
            onSuccess(res);
          }
        }
      );
    }
  };

  const handleSocialLogin = ({
    idpName,
    idpToken,
    email,
    firstName,
    lastName
  }) => {
    dispatch({ type: DISABLE_REGISTRATION_BUTTON, payload: true });

    window.Pelcro.user.idpLogin(
      {
        idp_name: idpName,
        idp_token: idpToken,
        email: email,
        first_name: firstName,
        last_name: lastName
      },
      (err, res) => {
        dispatch({
          type: DISABLE_REGISTRATION_BUTTON,
          payload: false
        });

        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: { type: "error", content: getErrorMessages(err) }
          });
          onFailure(err);
        } else {
          onSuccess(res);
        }
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_SELECT:
          return Update({
            ...state,
            selectFields: { ...state.selectFields, ...action.payload }
          });
        case SET_EMAIL:
          return Update({
            ...state,
            email: action.payload,
            emailError: null
          });
        case SET_PASSWORD:
          return Update({
            ...state,
            password: action.payload,
            passwordError: null
          });
        case SET_FIRST_NAME:
          return Update({
            ...state,
            firstName: action.payload,
            firstNameError: null
          });
        case SET_LAST_NAME:
          return Update({
            ...state,
            lastName: action.payload,
            lastNameError: null
          });
        case SET_PHONE:
          return Update({
            ...state,
            phone: action.payload,
            phoneError: null
          });
        case SET_COMPANY:
          return Update({
            ...state,
            company: action.payload,
            companyError: null
          });
        case SET_TITLE:
          return Update({
            ...state,
            title: action.payload,
            titleError: null
          });

        case SET_TEXT_FIELD:
          return Update({
            ...state,
            ...action.payload
          });

        case SET_CONFIRM_PASSWORD:
          return Update({
            ...state,
            confirmPassword: action.payload,
            confirmPasswordError: null
          });
        case SET_EMAIL_ERROR:
          return Update({
            ...state,
            emailError: action.payload,
            email: ""
          });
        case SET_PASSWORD_ERROR:
          return Update({
            ...state,
            passwordError: action.payload,
            password: ""
          });
        case SET_FIRST_NAME_ERROR:
          return Update({
            ...state,
            firstNameError: action.payload,
            firstName: ""
          });
        case SET_LAST_NAME_ERROR:
          return Update({
            ...state,
            lastNameError: action.payload,
            lastName: ""
          });
        case SET_PHONE_ERROR:
          return Update({
            ...state,
            phoneError: action.payload,
            phone: null
          });
        case SET_COMPANY_ERROR:
          return Update({
            ...state,
            companyError: action.payload,
            company: null
          });
        case SET_TITLE_ERROR:
          return Update({
            ...state,
            titleError: action.payload,
            title: null
          });
        case SET_TEXT_FIELD_ERROR:
          return Update({
            ...state,
            ...action.payload
          });
        case SET_CONFIRM_PASSWORD_ERROR:
          return Update({
            ...state,
            confirmPasswordError: action.payload,
            confirmPassword: ""
          });
        case CONFIRM_PASSWORD_USED:
          return Update({
            ...state,
            confirmPasswordUsed: action.payload
          });
        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });
        case RESET_LOGIN_FORM:
          return initialState;

        case DISABLE_REGISTRATION_BUTTON:
          return Update({ ...state, buttonDisabled: action.payload });

        case HANDLE_REGISTRATION:
          return UpdateWithSideEffect(
            { ...state, buttonDisabled: true },
            (state, dispatch) => handleRegister(state, dispatch)
          );
        case HANDLE_SOCIAL_LOGIN:
          return SideEffect(() => handleSocialLogin(action.payload));

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-register-container ${className}`}
    >
      <Provider value={{ state, dispatch }}>
        {children.length
          ? children.map((child, i) => {
              if (child) {
                return React.cloneElement(child, { store, key: i });
              }
            })
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

export { RegisterContainer, store };

/**
 * Checks if the current site has security token enabled
 * @return {boolean}
 */
function hasSecurityTokenEnabled() {
  const hasSecuritySdkLoaded = Boolean(
    window.Pelcro.site.read()?.security_key
  );
  return hasSecuritySdkLoaded;
}
