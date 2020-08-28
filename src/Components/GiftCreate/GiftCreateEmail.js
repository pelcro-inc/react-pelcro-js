import React from "react";
import { store } from "./GiftCreateContainer";
import { Email } from "../../SubComponents/Email";

export const GiftCreateEmail = (props) => (
  <Email id="pelcro-gift-create-email" store={store} {...props} />
);
