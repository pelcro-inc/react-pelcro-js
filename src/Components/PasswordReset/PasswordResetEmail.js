import React from "react";
import { store } from "./PasswordResetContainer";
import { Email } from "../../SubComponents/Email";

export const PasswordResetEmail = (props) => (
  <Email
    store={store}
    {...props}
    value={window.Pelcro.helpers.getURLParameter("email")}
    disabled
  />
);
