import React from "react";
import { store } from "./AddressCreateContainer";
import { CountrySelect } from "../../SubComponents/CountrySelect";

export const AddressCreateCountrySelect = (props) => (
  <CountrySelect store={store} {...props} />
);
