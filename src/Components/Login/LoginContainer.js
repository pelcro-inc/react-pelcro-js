import React, { createContext, useReducer } from "react";
import {
  SET_EMAIL,
  SET_PASSWORD,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
  RESET_LOGIN_FORM
} from "../../utils/action-types";

const initialState = {
  email: "",
  password: "",
  emailError: null,
  passwordError: null,
  buttonDisabled: true
};
const store = createContext(initialState);
const { Provider } = store;

const LoginContainer = ({ style, className, children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_EMAIL:
        return { ...state, email: action.payload, emailError: null };
      case SET_PASSWORD:
        return { ...state, password: action.payload, passwordError: null };
      case SET_EMAIL_ERROR:
        return { ...state, emailError: action.payload, email: "" };
      case SET_PASSWORD_ERROR:
        return { ...state, passwordError: action.payload, password: "" };
      case RESET_LOGIN_FORM:
        return initialState;
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
