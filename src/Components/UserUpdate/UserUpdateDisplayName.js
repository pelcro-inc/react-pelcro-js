import React from "react";
import { store } from "./UserUpdateContainer";
import { DisplayName } from "../../SubComponents/DisplayName";

export const UserUpdateDisplayName = (props) => (
  <DisplayName
    id="pelcro-user-display-name"
    store={store}
    {...props}
  />
);
