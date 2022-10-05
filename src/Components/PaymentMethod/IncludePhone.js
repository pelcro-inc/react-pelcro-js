import React from "react";
import { store } from "./PaymentMethodContainer";
import { Phone } from "./../../SubComponents/Phone";

export const IncludePhone = (props) => (
  <Phone store={store} {...props} />
);
