import React from "react";
import { store } from "./RegisterContainer";
import { Password } from "../../SubComponents/Password";

export const RegisterPassword = props => (
  <Password id="pelcro-register-password" store={store} {...props} />
);
