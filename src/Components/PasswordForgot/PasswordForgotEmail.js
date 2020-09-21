import React from "react";
import { store } from "./PasswordForgotContainer";
import { Email } from "../../SubComponents/Email";

export const PasswordForgotEmail = (props) => (
  <Email
    id="pelcro-input-email"
    disableEmailValidation={true}
    store={store}
    {...props}
  />
);
