import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_EMAIL,
  SET_LAST_NAME,
  SET_FIRST_NAME,
  HANDLE_SUBMIT,
  DISABLE_SUBMIT,
  SHOW_ALERT
} from "../../utils/action-types";

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  buttonDisabled: true,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const GiftCreateContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { t } = useTranslation("register");
  const handleSubmit = ({ email, firstName, lastName }, dispatch) => {
    if (!email) {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: t("gift.messages.enterEmail")
        }
      });
      onFailure();
    } else {
      onSuccess({
        email,
        firstName,
        lastName
      });
    }
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_EMAIL:
          return Update({
            ...state,
            email: action.payload
          });

        case SET_FIRST_NAME:
          return Update({
            ...state,
            firstName: action.payload
          });

        case SET_LAST_NAME:
          return Update({
            ...state,
            lastName: action.payload
          });

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case DISABLE_SUBMIT:
          return Update({ ...state, buttonDisabled: action.payload });
        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, buttonDisabled: true },
            (state, dispatch) => handleSubmit(state, dispatch)
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

export { GiftCreateContainer, store };
