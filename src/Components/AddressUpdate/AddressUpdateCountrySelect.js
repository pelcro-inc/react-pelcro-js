import React from "react";
import { store } from "./AddressUpdateContainer";
import { CountrySelect } from "../../SubComponents/CountrySelect";

export const AddressUpdateCountrySelect = (props) => (
  <CountrySelect store={store} {...props} />
);
