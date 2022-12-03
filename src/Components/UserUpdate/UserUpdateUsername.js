import React from "react";
import { store } from "./UserUpdateContainer";
import { UpdateUserNameInput } from "../../SubComponents/UpdateUserNameInput";

export const UserUpdateUsername = (props) => (
  <UpdateUserNameInput store={store} {...props} />
);
