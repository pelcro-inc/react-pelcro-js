import React from "react";
import { store } from "./PasswordlessRequestContainer";
import { Email } from "../../SubComponents/Email";

export const PasswordlessRequestEmail = (props) => (
  <Email store={store} {...props} />
);
