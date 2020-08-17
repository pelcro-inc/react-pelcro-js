import React, { createContext, useEffect } from "react";
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
  products: [],
  isEmpty: true
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
  useEffect(() => {
    if (window.Pelcro.ecommerce.products.read().length) {
      dispatch({
        type: SET_PRODUCTS,
        payload: window.Pelcro.ecommerce.products
          .read()
          .map((prod) => prod.skus.map((sku) => sku))
          .flat()
          .map((product) => {
            if (
              window.Pelcro.cartProducts &&
              window.Pelcro.cartProducts.length
            ) {
              product.quantity = window.Pelcro.cartProducts.filter(
                (productId) => +productId === +product.id
              ).length;
            }

            return product;
          })
      });
    } else {
      document.addEventListener(
        "PelcroEcommerceProductsLoaded",
        function (e) {
          dispatch({
            type: SET_PRODUCTS,
            payload: window.Pelcro.ecommerce.products
              .read()
              .map((prod) => prod.skus.map((sku) => sku))
              .flat()
              .map((product) => {
                if (
                  window.Pelcro.cartProducts &&
                  window.Pelcro.cartProducts.length
                ) {
                  product.quantity = window.Pelcro.cartProducts.filter(
                    (productId) => +productId === +product.id
                  ).length;
                }

                return product;
              })
          });
        }
      );
    }
  }, []);
  const submit = (state, dispatch) => {
    const items = state.products
      .filter((product) => product.quantity)
      .map((product) => {
        return {
          sku_id: product.id,
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
              (product) => product.quantity
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
