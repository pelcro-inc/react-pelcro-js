import React, { createContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_EMAIL,
  SET_PASSWORD,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
  RESET_LOGIN_FORM,
  HANDLE_LOGIN,
  DISABLE_LOGIN_BUTTON
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError } from "../../utils/showing-error";

const initialState = {
  email: "",
  password: "",
  emailError: null,
  passwordError: null,
  buttonDisabled: true
};
const store = createContext(initialState);
const { Provider } = store;

const LoginContainer = ({
  style,
  className,
  setView,
  onSuccess = () => {},
  children
}) => {
  const handleLogin = ({ email, password }, dispatch) => {
    window.Pelcro.user.login({ email, password }, (err, res) => {
      dispatch({ type: DISABLE_LOGIN_BUTTON, payload: false });

      if (err) {
        return showError(getErrorMessages(err), "pelcro-error-login");
      } else {
        setView("");
        onSuccess();
      }
    });
  };

  const [state, dispatch] = useReducerWithSideEffects((state, action) => {
    switch (action.type) {
      case SET_EMAIL:
        return Update({ ...state, email: action.payload, emailError: null });
      case SET_PASSWORD:
        return Update({
          ...state,
          password: action.payload,
          passwordError: null
        });
      case SET_EMAIL_ERROR:
        return Update({ ...state, emailError: action.payload, email: "" });
      case SET_PASSWORD_ERROR:
        return Update({
          ...state,
          passwordError: action.payload,
          password: ""
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
      default:
        throw new Error();
    }
  }, initialState);

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

export { LoginContainer, store };
