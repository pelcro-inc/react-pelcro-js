import React from "react";
import { store } from "./UserUpdateContainer";
import { Tin } from "../../SubComponents/Tin";

export const UserUpdateTin = (props) => (
  <Tin store={store} {...props} />
);
