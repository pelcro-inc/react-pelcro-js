import React, { createContext } from "react";
import { useTranslation } from "react-i18next";
import useReducerWithSideEffects, {
  Update
} from "use-reducer-with-side-effects";
import {SET_SUBSCRIPTION_SUSPEND_DATE, DISABLE_SUBMIT} from "../../utils/action-types";

const initialState = {
  suspendDate: null,
  buttonDisabled: false,
};
const store = createContext(initialState);
const { Provider } = store;

const SubscriptionSuspendContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  onFailure = () => {},
  children,
  ...props
}) => {
  const { t } = useTranslation("SubscriptionSuspend");

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_SUBSCRIPTION_SUSPEND_DATE:
          return Update({
            ...state,
            suspendDate: action.payload
          });
          
        case DISABLE_SUBMIT:
          return Update({ ...state, buttonDisabled: action.payload });

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-subscription-suspend-container ${className}`}
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

export { SubscriptionSuspendContainer, store };
