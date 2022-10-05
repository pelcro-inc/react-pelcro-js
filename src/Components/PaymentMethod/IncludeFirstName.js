import React from "react";
import { store } from "./PaymentMethodContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const IncludeFirstName = (props) => (
  <FirstName store={store} {...props} />
);
