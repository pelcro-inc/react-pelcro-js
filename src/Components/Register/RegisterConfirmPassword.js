import React from "react";
import { store } from "./RegisterContainer";
import { ConfirmPassword } from "../../SubComponents/ConfirmPassword";

export const RegisterCofirmPassword = props => (
  <ConfirmPassword store={store} {...props} />
);
