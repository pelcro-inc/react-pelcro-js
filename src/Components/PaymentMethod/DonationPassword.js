import React from "react";
import { store } from "./PaymentMethodContainer";
import { Password } from "../../SubComponents/Password";

export const DonationPassword = (props) => (
  <Password store={store} {...props} />
);
