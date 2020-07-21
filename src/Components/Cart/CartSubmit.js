import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./CartContainer";
import { HANDLE_SUBMIT } from "../../utils/action-types";

export const CartSubmit = ({ name, style, className }) => {
  const {
    dispatch,
    state: { products, isEmpty }
  } = useContext(store);
  const { t } = useTranslation("cart");

  const countProducts = () => {
    return products.filter(product => product.quantity).length;
  };

  if (!isEmpty) {
    return useMemo(
      () => (
        <button
          style={style}
          className={className}
          onClick={() => dispatch({ type: HANDLE_SUBMIT })}
        >
          {t("confirm")} with {countProducts()}{" "}
          {countProducts() % 10 === 1 ? "item" : "items"}{" "}
        </button>
      ),
      [className, style]
    );
  }
  return null;
};
