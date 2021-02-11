import React, { useContext } from "react";
import { getFormattedPriceByLocal } from "../../utils/utils";
import { store } from "./PaymentMethodContainer";

export const DiscountedPrice = () => {
  const {
    state: { updatedPrice, percentOff, currentPlan }
  } = useContext(store);
  const { default_locale } = Pelcro.site.read();

  if (percentOff) {
    return (
      <span>
        (-{percentOff}){" "}
        {getFormattedPriceByLocal(
          updatedPrice,
          currentPlan.currency,
          default_locale
        )}
      </span>
    );
  }

  return "";
};
