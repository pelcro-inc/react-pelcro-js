import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { calcAndFormatItemsTotal } from "../../utils/utils";
import { store } from "./CartContainer";

export const CartTotalPrice = () => {
  const {
    state: { alert }
  } = useContext(store);

  const { cartItems } = usePelcro();
  const totalPriceCurrency = cartItems[0].currency;

  const { t } = useTranslation("cart");

  if (!alert.content) {
    return (
      <>
        <p className="plc-mr-1 pelcro-cart-total-text">
          {t("total")}:
        </p>
        <p className="pelcro-cart-total">
          {calcAndFormatItemsTotal(cartItems, totalPriceCurrency)}
        </p>
      </>
    );
  }
  return null;
};
