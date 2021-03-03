import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { store } from "./ShopContainer";

let selectProduct;

export const ShopSelectProductButton = ({
  name,
  className,
  product,
  ...otherProps
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
      `pelcro-shop-product-${product.id}`
    );
    productButton.textContent = t("buttons.added");
    setTimeout(() => {
      setDisabled(false);
      productButton.textContent = t("buttons.select");
    }, 1000);
  };

  return (
    <Button
      {...otherProps}
      data-sku-id={product.id}
      id={`pelcro-shop-product-${product.id}`}
      className={`pelcro-add-to-cart-button ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {name ?? t("buttons.select")}
    </Button>
  );
};

export { selectProduct };
