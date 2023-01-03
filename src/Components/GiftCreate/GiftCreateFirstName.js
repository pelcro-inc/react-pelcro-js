import React from "react";
import { store } from "./GiftCreateContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const GiftCreateFirstName = (props) => (
  <FirstName store={store} {...props} />
);
