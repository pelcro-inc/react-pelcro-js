import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";

export const ShopSelectProductButton = ({
  itemId,
  onClick,
  ...otherProps
}) => {
  const { addToCart } = usePelcro();

  const { t } = useTranslation("shop");

  const [disabled, setDisabled] = useState(false);
  const [textContent, setTextContent] = useState(t("buttons.select"));

  const handleClick = () => {
    setDisabled(true);
    setTextContent(t("buttons.added"));
    addToCart(itemId);
    onClick?.();

    setTimeout(() => {
      setDisabled(false);
      setTextContent(t("buttons.select"));
    }, 1000);
  };

  return (
    <Button
      data-sku-id={itemId}
      id={`pelcro-shop-select-${itemId}`}
      onClick={handleClick}
      disabled={disabled}
      {...otherProps}
    >
      {textContent}
    </Button>
  );
};
