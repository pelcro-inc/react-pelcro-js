import React from "react";
import { store } from "./PasswordResetContainer";
import { Password } from "../../SubComponents/Password";

export const PasswordResetPassword = props => (
  <Password id="pelcro-input-password" store={store} {...props} />
);
