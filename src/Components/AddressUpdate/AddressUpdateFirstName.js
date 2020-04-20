import React from "react";
import { store } from "./AddressUpdateContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const AddressUpdateFirstName = (props) => (
  <FirstName id="pelcro-user-first-name" store={store} {...props} />
);
