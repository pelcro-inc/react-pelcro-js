import React from "react";
import { store } from "./PaymentMethodContainer";
import { LastName } from "../../SubComponents/LastName";

export const IncludeLastName = (props) => (
  <LastName store={store} {...props} />
);
