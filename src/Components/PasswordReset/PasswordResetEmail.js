import React from "react";
import { store } from "./PasswordResetContainer";
import { Email } from "../../SubComponents/Email";

export const PasswordResetEmail = (props) => (
  <Email
    id="pelcro-input-email"
    store={store}
    value={window.Pelcro.helpers.getURLParameter("email")}
    disabled
    {...props}
  />
);
