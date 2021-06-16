import React, { useContext } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { getFormattedPriceByLocal } from "../../utils/utils";
import { store } from "./PaymentMethodContainer";

export const DiscountedPrice = () => {
  const { plan } = usePelcro();

  const {
    state: { updatedPrice, percentOff }
  } = useContext(store);
  const { default_locale } = Pelcro.site.read();

  const planQuantity = plan?.quantity ?? 1;
  const priceFormatted = getFormattedPriceByLocal(
    updatedPrice * planQuantity,
    plan?.currency,
    default_locale
  );

  if (percentOff) {
    return (
      <div className="plc-my-2">
        (-{percentOff}) {priceFormatted}
      </div>
    );
  }

  return "";
};
