import React, { createContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  SideEffect,
  Update
} from "use-reducer-with-side-effects";
import { usePelcro } from "../../hooks/usePelcro";
import {
  DISABLE_SUBMIT,
  HANDLE_SUBMIT,
  SHOW_ALERT
} from "../../utils/action-types";

const initialState = {
  buttonDisabled: false,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const CartContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children
}) => {
  const { cartItems, set } = usePelcro();

  const { t } = useTranslation("shop");

  useEffect(() => {
    dispatch({ type: DISABLE_SUBMIT, payload: false });
    dispatch({
      type: SHOW_ALERT,
      payload: {
        type: "error",
        content: ""
      }
    });

    if (cartItems.length === 0) return;

    const itemsCurrencies = new Set(
      cartItems.map((item) => item.currency)
    );
    const cartHasMultipleCurrencies = itemsCurrencies.size > 1;

    if (cartHasMultipleCurrencies) {
      dispatch({ type: DISABLE_SUBMIT, payload: true });
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: t("messages.multipleCurrencies")
        }
      });
    } else {
      // const userCurrency = window.Pelcro.user.read().currency;
      // const itemsCurrency = cartItems[0].currency;

      // if (userCurrency && userCurrency !== itemsCurrency) {
      //   dispatch({ type: DISABLE_SUBMIT, payload: true });
      //   dispatch({
      //     type: SHOW_ALERT,
      //     payload: {
      //       type: "error",
      //       content: t("messages.currencyMismatch", {
      //         currency: userCurrency.toUpperCase()
      //       })
      //     }
      //   });
      // }
    }
  }, [cartItems]);

  const submit = (state, dispatch) => {
    set({ order: [...cartItems] });
    onSuccess(cartItems);
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case DISABLE_SUBMIT:
          return Update({ ...state, buttonDisabled: action.payload });
        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });
        case HANDLE_SUBMIT:
          return SideEffect((state, dispatch) =>
            submit(state, dispatch)
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
      className={`pelcro-container pelcro-cart-container ${className}`}
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

export { CartContainer, store };
