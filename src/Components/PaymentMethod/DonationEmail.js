import React from "react";
import { store } from "./PaymentMethodContainer";
import { Email } from "../../SubComponents/Email";

export const DonationEmail = (props) => (
  <Email store={store} {...props} />
);
