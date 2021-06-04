import React from "react";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as RemoveIcon } from "../../assets/x-icon.svg";

export const CartRemoveItemButton = ({
  children,
  removeItem,
  itemId,
  ...otherProps
}) => {
  return (
    <Button
      {...otherProps}
      variant="icon"
      data-key={itemId}
      icon={
        <RemoveIcon
          fill="white"
          aria-hidden="true"
          focusable="false"
        />
      }
      onClick={() => removeItem(itemId)}
    >
      {children}
    </Button>
  );
};
