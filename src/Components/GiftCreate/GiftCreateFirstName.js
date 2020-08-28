import React from "react";
import { store } from "./GiftCreateContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const GiftCreateFirstName = (props) => (
  <FirstName
    id="pelcro-gift-create-first-name"
    store={store}
    {...props}
  />
);
