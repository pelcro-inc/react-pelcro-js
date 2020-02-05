import React, { createContext, useReducer } from "react";
import {
  SET_EMAIL,
  SET_PASSWORD,
  SET_EMAIL_ERROR,
  SET_PASSWORD_ERROR,
  RESET_LOGIN_FORM,
  SET_CONFIRM_PASSWORD,
  CONFIRM_PASSWORD_USED,
  SET_CONFIRM_PASSWORD_ERROR
} from "../../utils/action-types";

const initialState = {
  email: "",
  password: "",
  emailError: null,
  passwordError: null,
  confirmPassword: "",
  confirmPasswordError: null,
  confirmPasswordUsed: false
};
const store = createContext(initialState);
const { Provider } = store;

const RegisterContainer = ({ style, className, children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case SET_EMAIL:
        return { ...state, email: action.payload, emailError: null };
      case SET_PASSWORD:
        return { ...state, password: action.payload, passwordError: null };
      case SET_CONFIRM_PASSWORD:
        return {
          ...state,
          confirmPassword: action.payload,
          confirmPasswordError: null
        };
      case SET_EMAIL_ERROR:
        return { ...state, emailError: action.payload, email: "" };
      case SET_PASSWORD_ERROR:
        return { ...state, passwordError: action.payload, password: "" };
      case SET_CONFIRM_PASSWORD_ERROR:
        return {
          ...state,
          confirmPasswordError: action.payload,
          confirmPassword: ""
        };
      case CONFIRM_PASSWORD_USED:
        return { ...state, confirmPasswordUsed: action.payload };
      case RESET_LOGIN_FORM:
        return initialState;

      default:
        throw new Error();
    }
  }, initialState);

  return (
    <form style={{ ...style }} className={className}>
      <Provider value={{ state, dispatch }}>
        {children.length
          ? children.map((child, i) =>
              React.cloneElement(child, { store, key: i })
            )
          : React.cloneElement(children, { store })}
      </Provider>
    </form>
  );
};

export { RegisterContainer, store };
