import React from "react";
import { store } from "./UserUpdateContainer";
import { DisplayName } from "../../SubComponents/DisplayName";

export const UserUpdateDisplayName = (props) => (
  <DisplayName store={store} {...props} />
);
