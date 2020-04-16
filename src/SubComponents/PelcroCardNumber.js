import React from "react";
import { CardNumberElement } from "react-stripe-elements";

export const PelcroCardNumber = (props) => {
  return <CardNumberElement {...props} />;
};
