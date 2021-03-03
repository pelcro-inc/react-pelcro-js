import React from "react";
import { store } from "./UserUpdateContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const UserUpdateFirstName = (props) => (
  <FirstName store={store} {...props} />
);
