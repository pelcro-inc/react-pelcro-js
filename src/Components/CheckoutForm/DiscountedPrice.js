import React, { useContext } from "react";
import { store } from "./CheckoutFormContainer";

export const DiscountedPrice = () => {
  const {
    state: { percentOff }
  } = useContext(store);

  if (percentOff) {
    return <span>{percentOff}</span>;
  }

  return "";
};
