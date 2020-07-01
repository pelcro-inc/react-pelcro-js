import React from "react";
import { store } from "./PasswordResetContainer";
import { ConfirmPassword } from "../../SubComponents/ConfirmPassword";

export const PasswordResetConfirmPassword = props => (
  <ConfirmPassword store={store} {...props} />
);
