import React from "react";
import { store } from "./UserUpdateContainer";
import { LastName } from "../../SubComponents/LastName";

export const UserUpdateLastName = (props) => (
  <LastName store={store} {...props} />
);
