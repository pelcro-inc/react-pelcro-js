import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  SET_GIFT_CODE,
  HANDLE_SUBMIT,
  DISABLE_SUBMIT,
  SHOW_ALERT
} from "../../utils/action-types";

const initialState = {
  giftCode: "",
  buttonDisabled: true,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const GiftRedeemContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  onDisplay = () => {},
  children
}) => {
  const { t } = useTranslation("register");
  const { set } = usePelcro();

  useEffect(() => {
    onDisplay();
  }, []);

  const handleRedeem = ({ giftCode }, dispatch) => {
    if (!giftCode) {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: t("redeem.messages.enterGiftCode")
        }
      });
      onFailure();
    } else {
      set({ giftCode });
      onSuccess(giftCode);
    }
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_GIFT_CODE:
          return Update({
            ...state,
            giftCode: action.payload
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
            (state, dispatch) => handleRedeem(state, dispatch)
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
      className={`pelcro-container pelcro-gift-redeem-container ${className}`}
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

export { GiftRedeemContainer, store };
