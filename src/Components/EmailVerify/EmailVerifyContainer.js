import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  Update,
  UpdateWithSideEffect
} from "use-reducer-with-side-effects";
import {
  HANDLE_SUBMIT,
  LOADING,
  SHOW_ALERT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";

const initialState = {
  isSubmitting: false,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const EmailVerifyContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children,
  ...props
}) => {
  const { t } = useTranslation("verifyEmail");

  const submit = () => {
    window.Pelcro.user.resendEmailVerificationToken((err, res) => {
      dispatch({ type: LOADING, payload: false });

      if (err) {
        dispatch({
          type: SHOW_ALERT,
          payload: {
            type: "error",
            content: getErrorMessages(err)
          }
        });
        return onFailure(err);
      }

      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "success",
          content: t("messages.resent")
        }
      });
      return onSuccess(res);
    });
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        case LOADING:
          return Update({
            ...state,
            isSubmitting: action.payload
          });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, isSubmitting: true },
            (state, dispatch) => submit()
          );

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-email-verify-container ${className}`}
    >
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

export { EmailVerifyContainer, store };
