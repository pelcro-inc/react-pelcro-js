import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  Update
} from "use-reducer-with-side-effects";
import {SET_CANCEL_SUBSCRIPTION_REASON} from "../../utils/action-types";

const initialState = {
  cancelationReason: "",
};
const store = createContext(initialState);
const { Provider } = store;

const SubscriptionCancelContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children,
  ...props
}) => {
  const { t } = useTranslation("verifyEmail");

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_CANCEL_SUBSCRIPTION_REASON:
          return Update({
            ...state,
            cancelationReason: action.payload
          });
          
        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-subscription-cancel-container ${className}`}
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

export { SubscriptionCancelContainer, store };
