import React from "react";
import { store } from "./AddressUpdateContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const AddressUpdateFirstName = (props) => (
  <FirstName store={store} {...props} />
);
