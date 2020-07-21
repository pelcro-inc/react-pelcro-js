import React, { useContext, useMemo } from "react";
import { store } from "./CartContainer";
import { HANDLE_REMOVE_PRODUCT } from "../../utils/action-types";

export const CartRemoveProductButton = ({
  name,
  style,
  className,
  children,
  product
}) => {
  const {
    dispatch,
    state: { isEmpty }
  } = useContext(store);

  if (!isEmpty) {
    return useMemo(
      () => (
        <button
          id={`cart-btn-for-${product.id}`}
          data-key={product.id}
          style={style}
          className={className}
          onClick={() => dispatch({ type: HANDLE_REMOVE_PRODUCT })}
        >
          {children}
        </button>
      ),
      [className, style]
    );
  }
  return null;
};
