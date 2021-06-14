import React from "react";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as RemoveIcon } from "../../assets/x-icon.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const CartRemoveItemButton = ({
  children,
  itemId,
  ...otherProps
}) => {
  const { removeFromCart } = usePelcro();

  return (
    <Button
      {...otherProps}
      variant="icon"
      data-key={itemId}
      icon={<RemoveIcon aria-hidden="true" focusable="false" />}
      className="plc-bg-transparent plc-w-5 plc-h-5"
      onClick={() => removeFromCart(itemId)}
    >
      {children}
    </Button>
  );
};
