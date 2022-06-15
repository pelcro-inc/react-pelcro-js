import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";

export const ShopSelectProductButton = ({
  item,
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
    addToCart(item);
    onClick?.();

    setTimeout(() => {
      setDisabled(false);
      setTextContent(t("buttons.select"));
    }, 1000);
  };

  return (
    <Button
      data-sku-id={item.id}
      id={`pelcro-shop-select-${item.id}`}
      onClick={handleClick}
      disabled={disabled}
      {...otherProps}
    >
      {textContent}
    </Button>
  );
};
