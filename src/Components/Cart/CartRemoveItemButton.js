import React from "react";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as RemoveIcon } from "../../assets/x-icon.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const CartRemoveItemButton = ({
  children,
  itemId,
  onClick,
  ...otherProps
}) => {
  const { removeFromCart } = usePelcro();

  return (
    <button
      data-key={itemId}
      className="hover:plc-text-red-500 hover:plc-bg-transparent plc-font-medium plc-text-sm plc-text-gray-500"
      onClick={() => {
        removeFromCart(itemId);
        onClick?.();
      }}
      {...otherProps}
    >
      {children}
      Remove
    </button>
  );
};
