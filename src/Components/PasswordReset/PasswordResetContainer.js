import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_EMAIL,
  SET_PASSWORD,
  SET_TOKEN,
  SET_CONFIRM_PASSWORD,
  HANDLE_SUBMIT,
  DISABLE_SUBMIT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError, showSuccess } from "../../utils/showing-error";

const initialState = {
  email: "",
  password: "",
  confirmPassword: "",
  token: "",
  buttonDisabled: true
};
const store = createContext(initialState);
const { Provider } = store;

const PasswordResetContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { t } = useTranslation("passwordReset");

  const handleSubmit = (
    { email, password, confirmPassword, token },
    dispatch
  ) => {
    window.Pelcro.password.reset(
      {
        email,
        password,
        password_confirmation: confirmPassword,
        token
      },
      (err, res) => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });

        if (err) {
          showError(
            getErrorMessages(err),
            "pelcro-error-password-reset"
          );
          return onFailure(err);
        } else {
          showSuccess(
            t("passwordUpdated"),
            "pelcro-error-password-reset"
          );
          onSuccess();
        }
      }
    );
  };

  useEffect(() => {
    dispatch({
      type: SET_EMAIL,
      payload: window.Pelcro.helpers.getURLParameter("email")
    });
    initialState.email = window.Pelcro.helpers.getURLParameter(
      "email"
    );
    dispatch({
      type: SET_TOKEN,
      payload: window.Pelcro.helpers.getURLParameter("token")
    });
  }, []);

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_EMAIL:
          return Update({
            ...state,
            email: action.payload
          });
        case SET_PASSWORD:
          return Update({
            ...state,
            password: action.payload
          });
        case SET_CONFIRM_PASSWORD:
          return Update({
            ...state,
            confirmPassword: action.payload
          });
        case SET_TOKEN:
          return Update({
            ...state,
            token: action.payload
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

export { PasswordResetContainer, store };
