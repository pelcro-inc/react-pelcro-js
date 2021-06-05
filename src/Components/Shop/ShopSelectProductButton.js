import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";

export const ShopSelectProductButton = ({
  itemId,
  ...otherProps
}) => {
  const { addCartItem } = usePelcro();

  const { t } = useTranslation("shop");

  const [disabled, setDisabled] = useState(false);
  const [textContent, setTextContent] = useState(t("buttons.select"));

  const handleClick = () => {
    setDisabled(true);
    setTextContent(t("buttons.added"));
    addCartItem(itemId);

    setTimeout(() => {
      setDisabled(false);
      setTextContent(t("buttons.select"));
    }, 1000);
  };

  return (
    <Button
      {...otherProps}
      data-sku-id={itemId}
      id={`pelcro-shop-product-${itemId}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {textContent}
    </Button>
  );
};
