import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Button } from "../../SubComponents/Button";
import { cartItemAdded } from "../../utils/events";

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
    addToCart(item.id);
    document.dispatchEvent(cartItemAdded(item));
    
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
