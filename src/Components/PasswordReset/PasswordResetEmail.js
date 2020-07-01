import React from "react";
import { store } from "./PasswordResetContainer";
import { Email } from "../../SubComponents/Email";

export const PasswordResetEmail = props => (
  <Email id="pelcro-input-email" store={store} {...props} disabled />
);
