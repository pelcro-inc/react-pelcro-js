import React from "react";
import { store } from "./UserUpdateContainer";
import { Phone } from "../../SubComponents/Phone";

export const UserUpdatePhone = props => (
  <Phone id="pelcro-user-phone" store={store} {...props} />
);
