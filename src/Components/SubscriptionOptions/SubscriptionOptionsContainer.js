import React, { createContext } from "react";
import useReducerWithSideEffects, {
  SideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  HANDLE_SUBMIT,
  SWITCH_TO_RENEW,
  SWITCH_TO_NEW
} from "../../utils/action-types";

const initialState = { selectedOption: "" };
const store = createContext(initialState);
const { Provider } = store;

const SubscriptionOptionsContainer = ({
  style,
  className = "",
  onRenewSubSuccess = () => {},
  onNewSubSuccess = () => {},
  children,
  ...props
}) => {
  const submit = ({ selectedOption }, dispatch) => {
    if (selectedOption === "renew") return onRenewSubSuccess();
    if (selectedOption === "new") return onNewSubSuccess();
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SWITCH_TO_NEW:
          return Update({
            ...state,
            selectedOption: "new"
          });

        case SWITCH_TO_RENEW:
          return Update({
            ...state,
            selectedOption: "renew"
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
      className={`pelcro-container pelcro-subscription-options-container ${className}`}
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

export { SubscriptionOptionsContainer, store };
