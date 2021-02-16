import React from "react";
import { store } from "./AddressCreateContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const AddressCreateFirstName = (props) => (
  <FirstName store={store} {...props} />
);
