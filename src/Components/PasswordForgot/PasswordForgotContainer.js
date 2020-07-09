import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_EMAIL,
  HANDLE_SUBMIT,
  DISABLE_SUBMIT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError, showSuccess } from "../../utils/showing-error";

const initialState = {
  email: "",
  buttonDisabled: false
};
const store = createContext(initialState);
const { Provider } = store;

const PasswordForgotContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { t } = useTranslation("passwordForgot");

  const handleSubmit = ({ email }, dispatch) => {
    window.Pelcro.password.forgot(
      {
        email
      },
      (err, res) => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });

        if (err) {
          showError(
            getErrorMessages(err),
            "pelcro-error-password-forgot"
          );
          return onFailure(err);
        } else {
          showSuccess(
            t("passwordResetEmailSent"),
            "pelcro-success-password-forgot"
          );
          onSuccess();
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
            email: action.payload
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

export { PasswordForgotContainer, store };
