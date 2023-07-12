import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
  SideEffect
} from "use-reducer-with-side-effects";
import {
  SET_EMAIL,
  SET_USERNAME,
  SET_PASSWORD,
  SET_USERNAME_ERROR,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
  RESET_LOGIN_FORM,
  HANDLE_LOGIN,
  DISABLE_LOGIN_BUTTON,
  SHOW_ALERT,
  HANDLE_SOCIAL_LOGIN
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

const initialState = {
  email: "",
  username: "",
  password: "",
  emailError: null,
  usernameError: null,
  passwordError: null,
  buttonDisabled: false,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const LoginContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const handleLogin = ({ email, username, password }, dispatch) => {
    window.Pelcro.user.login(
      {
        ...(email && { email }),
        ...(username && { username }),
        password
      },
      (err, res) => {
        dispatch({ type: DISABLE_LOGIN_BUTTON, payload: false });

        if (err) {
          dispatch({
            type: SHOW_ALERT,
            payload: { type: "error", content: getErrorMessages(err) }
          });
          onFailure(err);
        } else {
          onSuccess(res);
          if (enableReactGA4) {
            ReactGA4.event("Logged in", {
              nonInteraction: true
            });
          } else {
            ReactGA?.event?.({
              category: "ACTIONS",
              action: "Logged in",
              nonInteraction: true
            });
          }
        }
      }
    );
  };

  const handleSocialLogin = ({
    idpName,
    idpToken,
    email,
    firstName,
    lastName
  }) => {
    dispatch({ type: DISABLE_LOGIN_BUTTON, payload: true });

    window.Pelcro.user.idpLogin(
      {
        idp_name: idpName,
        idp_token: idpToken,
        email: email,
        first_name: firstName,
        last_name: lastName
      },
      (err, res) => {
        dispatch({ type: DISABLE_LOGIN_BUTTON, payload: false });

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
        case SET_EMAIL:
          return Update({
            ...state,
            email: action.payload,
            emailError: null
          });
        case SET_USERNAME:
          return Update({
            ...state,
            username: action.payload,
            usernameError: null
          });
        case SET_PASSWORD:
          return Update({
            ...state,
            password: action.payload,
            passwordError: null
          });
        case SET_EMAIL_ERROR:
          return Update({
            ...state,
            emailError: action.payload,
            email: ""
          });
        case SET_USERNAME_ERROR:
          return Update({
            ...state,
            usernameError: action.payload,
            username: ""
          });
        case SET_PASSWORD_ERROR:
          return Update({
            ...state,
            passwordError: action.payload,
            password: ""
          });
        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });
        case RESET_LOGIN_FORM:
          return initialState;
        case DISABLE_LOGIN_BUTTON:
          return Update({ ...state, buttonDisabled: action.payload });
        case HANDLE_LOGIN:
          return UpdateWithSideEffect(
            { ...state, buttonDisabled: true },
            (state, dispatch) => handleLogin(state, dispatch)
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
      className={`pelcro-container pelcro-login-container ${className}`}
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

export { LoginContainer, store };
