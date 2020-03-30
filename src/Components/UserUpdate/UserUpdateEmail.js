import React from "react";
import { store } from "./UserUpdateContainer";
import { Email } from "../../SubComponents/Email";

export const UserUpdateEmail = props => (
  <Email
    disabled={true}
    id="pelcro-login-email"
    value={window.Pelcro.user.read().email}
    store={store}
    {...props}
  />
);
