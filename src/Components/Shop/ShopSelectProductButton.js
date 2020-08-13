import React, { useContext, useMemo, useState } from "react";
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

  const [disabled, setDisabled] = useState(false);

  const handleClick = () => {
    setDisabled(true);
    const productButton = document.getElementById(
      `pelcro-prefix-btn-for-${product.id}`
    );
    productButton.textContent = t("buttons.added");
    setTimeout(() => {
      setDisabled(false);
      productButton.textContent = t("buttons.select");
    }, 1000);
  };

  return useMemo(
    () => (
      <button
        data-sku-id={product.id}
        id={`pelcro-prefix-btn-for-${product.id}`}
        style={style}
        className={`pelcro-add-to-cart-button ${className}`}
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </button>
    ),
    [className, style, disabled]
  );
};

export { selectProduct };
