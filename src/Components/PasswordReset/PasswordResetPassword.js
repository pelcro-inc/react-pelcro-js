import React from "react";
import { store } from "./PasswordResetContainer";
import { Password } from "../../SubComponents/Password";

export const PasswordResetPassword = (props) => (
  <Password store={store} {...props} />
);
