import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  SET_PASSWORD,
  HANDLE_SUBMIT,
  DISABLE_SUBMIT,
  SET_NEW_PASSWORD,
  SET_CONFIRM_NEW_PASSWORD,
  VALIDATE_PASSWORD,
  VALIDATE_NEW_PASSWORD,
  VALIDATE_CONFIRM_NEW_PASSWORD,
  RESET_PASSWORD_ERROR,
  RESET_NEW_PASSWORD_ERROR,
  RESET_CONFIRM_NEW_PASSWORD_ERROR,
  SHOW_ALERT,
  PASSWORD_CHANGE_SUCCESS
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  currentPasswordError: "",
  newPasswordError: "",
  confirmNewPasswordError: "",
  isSubmitting: false,
  passwordChanged: false,
  alert: {
    type: "error",
    content: ""
  }
};
export const store = createContext(initialState);
const { Provider } = store;

export const PasswordChangeContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { t } = useTranslation("passwordChange");

  const handleSubmit = (
    { currentPassword, newPassword, confirmNewPassword },
    dispatch
  ) => {
    window.Pelcro.password.update(
      {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword
      },
      (err, res) => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });

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
              content: t("passwordChanged")
            }
          });
          dispatch({ type: PASSWORD_CHANGE_SUCCESS });
          onSuccess(res);
        }
      }
    );
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_PASSWORD:
          return Update({
            ...state,
            currentPassword: action.payload
          });
        case SET_NEW_PASSWORD:
          return Update({
            ...state,
            newPassword: action.payload
          });
        case SET_CONFIRM_NEW_PASSWORD:
          return Update({
            ...state,
            confirmNewPassword: action.payload
          });
        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });
        case VALIDATE_PASSWORD:
          if (!state.currentPassword.length) {
            return Update({
              ...state,
              currentPasswordError: t("required")
            });
          }
          return Update({
            ...state,
            currentPasswordError: ""
          });
        case VALIDATE_NEW_PASSWORD:
          if (!state.newPassword.length) {
            return Update({
              ...state,
              newPasswordError: t("required")
            });
          }
          if (state.newPassword.length < 6) {
            return Update({
              ...state,
              newPasswordError: t("weakPassword")
            });
          }
          return Update({
            ...state,
            newPasswordError: ""
          });
        case VALIDATE_CONFIRM_NEW_PASSWORD:
          if (!state.confirmNewPassword.length) {
            return Update({
              ...state,
              confirmNewPasswordError: t("required")
            });
          }
          if (state.confirmNewPassword !== state.newPassword) {
            return Update({
              ...state,
              confirmNewPasswordError: t("passwordsNotMatching")
            });
          }
          return Update({
            ...state,
            confirmNewPasswordError: ""
          });
        case RESET_PASSWORD_ERROR:
          return Update({
            ...state,
            currentPasswordError: ""
          });
        case RESET_NEW_PASSWORD_ERROR:
          return Update({
            ...state,
            newPasswordError: ""
          });
        case RESET_CONFIRM_NEW_PASSWORD_ERROR:
          return Update({
            ...state,
            confirmNewPasswordError: ""
          });
        case DISABLE_SUBMIT:
          return Update({ ...state, isSubmitting: action.payload });
        case PASSWORD_CHANGE_SUCCESS:
          return Update({ ...state, passwordChanged: true });
        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, isSubmitting: true },
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
