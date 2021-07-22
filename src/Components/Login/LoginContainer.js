import React, { createContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
  SideEffect
} from "use-reducer-with-side-effects";
import {
  SET_EMAIL,
  SET_PASSWORD,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
  RESET_LOGIN_FORM,
  HANDLE_LOGIN,
  DISABLE_LOGIN_BUTTON,
  SHOW_ALERT,
  HANDLE_SOCIAL_LOGIN
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  email: "",
  password: "",
  emailError: null,
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
  className,
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const handleLogin = ({ email, password }, dispatch) => {
    window.Pelcro.user.login({ email, password }, (err, res) => {
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
    });
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
    <div style={{ ...style }} className={className}>
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
