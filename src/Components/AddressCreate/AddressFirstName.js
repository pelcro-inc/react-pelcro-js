import React from "react";
import { store } from "./AddressCreateContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const AddressFirstName = props => (
  <FirstName id="pelcro-user-first-name" store={store} {...props} />
);
