import React, { createContext } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import {
  SET_PRODUCTS,
  HANDLE_REMOVE_PRODUCT,
  HANDLE_SUBMIT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError } from "../../utils/showing-error";

const initialState = {
  products: window.Pelcro.product.listGoods(),
  isEmpty: window.Pelcro.product
    .listGoods()
    .filter(product => product.quantity).length
};
const store = createContext(initialState);
const { Provider } = store;

const CartContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  getProducts = () => {},
  children
}) => {
  const submit = (state, dispatch) => {
    const items = state.products
      .filter(product => product.quantity)
      .map(product => {
        return {
          type: "sku",
          parent: product.id,
          quantity: product.quantity
        };
      });

    onSuccess(items);
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_PRODUCTS:
          getProducts(action.payload);
          return Update({
            ...state,
            products: action.payload,
            isEmpty: !action.payload.filter(
              product => product.quantity
            ).length
          });

        case HANDLE_SUBMIT:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true },
            (state, dispatch) => submit(state, dispatch)
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

export { CartContainer, store };
