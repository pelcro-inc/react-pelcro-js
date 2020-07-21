import React, { useContext, useMemo } from "react";
import { store } from "./CartContainer";
import { SET_PRODUCTS } from "../../utils/action-types";

export const CartRemoveProductButton = ({
  style,
  className,
  children,
  product
}) => {
  const {
    dispatch,
    state: { isEmpty, products }
  } = useContext(store);

  const removeProduct = e => {
    let productContainer = {};
    const id = e.target.dataset.key;
    const productArr = products.slice();
    for (const product of productArr) {
      if (product.id === id) {
        if (product.quantity === 1) {
          product.quantity -= 1;

          dispatch({ type: SET_PRODUCTS, payload: productArr });

          productContainer = document.getElementById(
            `pelcro-prefix-container-product-${product.id}`
          );
          if (productContainer)
            productContainer.classList.add(
              "pelcro-prefix-product-container-wrapper"
            );
        } else {
          product.quantity -= 1;

          dispatch({ type: SET_PRODUCTS, payload: productArr });
        }
      }
    }
  };

  if (!isEmpty) {
    return useMemo(
      () => (
        <button
          id={`cart-btn-for-${product.id}`}
          data-key={product.id}
          style={style}
          className={className}
          onClick={removeProduct}
        >
          {children}
        </button>
      ),
      [className, style]
    );
  }
  return null;
};
