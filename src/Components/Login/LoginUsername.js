import React from "react";
import { store } from "./LoginContainer";
import { UserNameInput } from "../../SubComponents/UserNameInput";

export const LoginUsername = (props) => (
  <UserNameInput store={store} {...props} />
);
