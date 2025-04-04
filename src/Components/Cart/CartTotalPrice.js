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
        <p className="">
          {t("total")}:
        </p>
        <p className="">
          {calcAndFormatItemsTotal(cartItems, totalPriceCurrency)}
        </p>
      </>
    );
  }
  return null;
};
