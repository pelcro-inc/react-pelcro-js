import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./ShopContainer";
import { SET_PRODUCTS } from "../../utils/action-types";

let selectProduct;

export const ShopSelectProductButton = ({
  style,
  className,
  children,
  product
}) => {
  const {
    dispatch,
    state: { products }
  } = useContext(store);
  const { t } = useTranslation("shop");

  selectProduct = e => {
    let productButton = {};
    const id = e.target.dataset.skuId;
    const productArr = products.slice();

    // Display added to cart message
    for (const product of productArr) {
      if (product.id === id) {
        product.quantity += 1;
        productButton = document.getElementById(
          `pelcro-prefix-btn-for-${product.id}`
        );
        productButton.disabled = true;
        productButton.textContent = t("buttons.added");
      }
    }

    // Hide added to cart message after a delay
    setTimeout(() => {
      productButton.disabled = false;
      productButton.textContent = t("buttons.select");
    }, 1000);

    dispatch({ type: SET_PRODUCTS, payload: productArr });
  };

  return useMemo(
    () => (
      <button
        data-sku-id={product.id}
        id={`pelcro-prefix-btn-for-${product.id}`}
        style={style}
        className={className}
        onClick={selectProduct}
      >
        {children}
      </button>
    ),
    [className, style]
  );
};

export { selectProduct };
