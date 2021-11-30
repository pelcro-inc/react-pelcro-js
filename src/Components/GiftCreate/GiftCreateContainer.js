import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  SET_EMAIL,
  SET_LAST_NAME,
  SET_FIRST_NAME,
  SET_START_DATE,
  SET_GIFT_MESSAGE,
  HANDLE_SUBMIT,
  DISABLE_SUBMIT,
  SHOW_ALERT
} from "../../utils/action-types";
import { getDateWithoutTime } from "../../utils/utils";

const initialState = {
  email: "",
  firstName: "",
  lastName: "",
  startDate: null,
  giftMessage: "",
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
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { t } = useTranslation("register");
  const { set } = usePelcro();

  const handleSubmit = (state, dispatch) => {
    const giftRecipient = {
      email: state.email,
      firstName: state.firstName,
      lastName: state.lastName,
      startDate: state.startDate,
      giftMessage: state.giftMessage
    };

    if (!giftRecipient.email) {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: t("gift.messages.enterEmail")
        }
      });
      return onFailure();
    }

    if (giftRecipient.startDate) {
      const nowDate = getDateWithoutTime(new Date());
      const yearFromNowDate = getDateWithoutTime(
        new Date(new Date().setFullYear(nowDate.getFullYear() + 1))
      );
      const submittedDate = getDateWithoutTime(
        new Date(giftRecipient.startDate)
      );

      if (
        submittedDate < nowDate ||
        submittedDate > yearFromNowDate
      ) {
        dispatch({
          type: SHOW_ALERT,
          payload: {
            type: "error",
            content: t("gift.messages.invalidDate")
          }
        });
        return onFailure();
      }
    }

    set({ giftRecipient });
    return onSuccess(giftRecipient);
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

        case SET_START_DATE:
          return Update({
            ...state,
            startDate: action.payload
          });

        case SET_GIFT_MESSAGE:
          return Update({
            ...state,
            giftMessage: action.payload
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
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-gift-create-container ${className}`}
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

export { GiftCreateContainer, store };
