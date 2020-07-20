import React, { createContext, useEffect } from "react";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";
import { SET_PRODUCTS } from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError } from "../../utils/showing-error";

const initialState = {
  products: window.Pelcro.product.listGoods(),
  isEmpty: !initialState.products.filter(product => product.quantity)
    .length
};
const store = createContext(initialState);
const { Provider } = store;

const CartContainer = ({
  style,
  className,
  onSuccess = () => {},
  onFailure = () => {},
  setProducts,
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

    // setOrder(items);

    onSuccess(items);
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case SET_PRODUCTS:
          setProducts(action.payload);
          return Update({
            ...state,
            products: action.payload,
            isEmpty: !state.products.filter(
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
