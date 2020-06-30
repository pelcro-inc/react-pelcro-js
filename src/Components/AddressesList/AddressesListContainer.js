import React, { createContext } from "react";
import useReducerWithSideEffects, {
  Update
} from "use-reducer-with-side-effects";
import { SET_ADDRESS_ID } from "../../utils/action-types";

const initialState = {
  addressId: null
};
const store = createContext(initialState);
const { Provider } = store;

const AddressesListContainer = ({
  style,
  className,
  onSuccess = () => {},
  children
}) => {
  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_ADDRESS_ID:
          onSuccess();
          return Update({
            ...state,
            addressId: action.payload
          });

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

export { AddressesListContainer, store };
