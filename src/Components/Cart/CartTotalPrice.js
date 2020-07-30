import React, { useContext } from "react";
import { store } from "./CartContainer";

export const CartTotalPrice = () => {
  const {
    state: { products, isEmpty },
    dispatch
  } = useContext(store);

  const countTotal = () => {
    const productArr = products.slice();
    let total = 0;
    for (const product of productArr) {
      total += parseFloat(
        (product.sku[0].price * product.quantity).toFixed(2)
      );
    }
    return parseFloat(total).toLocaleString("fr-CA", {
      style: "currency",
      currency: "CAD"
    });
  };

  if (!isEmpty) {
    return <>{countTotal()}</>;
  }

  return null;
};
