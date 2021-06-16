import React, { useContext } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { getFormattedPriceByLocal } from "../../utils/utils";
import { store } from "./PaymentMethodContainer";

export const DiscountedPrice = () => {
  const {
    state: { updatedPrice, percentOff, currentPlan }
  } = useContext(store);
  const { default_locale } = Pelcro.site.read();

  const { order } = usePelcro();
  const ecommOrderCurrency = order?.currency ?? order?.[0]?.currency;

  if (percentOff) {
    return (
      <div className="plc-my-2">
        (-{percentOff}){" "}
        {getFormattedPriceByLocal(
          updatedPrice,
          ecommOrderCurrency ?? currentPlan?.currency,
          default_locale
        )}
      </div>
    );
  }

  return "";
};
