import React, { createContext } from "react";
import useReducerWithSideEffects, {
  SideEffect
} from "use-reducer-with-side-effects";
import { HANDLE_SUBMIT } from "../../utils/action-types";

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const InvoiceDetailsContainer = ({
  style,
  className = "",
  onSuccess = () => {},
  children,
  ...props
}) => {
  const onPayButtonClick = () => {
    return onSuccess();
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case HANDLE_SUBMIT:
          return SideEffect((state, dispatch) => onPayButtonClick());

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-invoice-details-container ${className}`}
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

export { InvoiceDetailsContainer, store };
