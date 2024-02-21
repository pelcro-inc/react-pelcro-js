import React from "react";
import { store } from "./UserUpdateContainer";
import { Company } from "../../SubComponents/Company";

export const UserUpdateCompany = (props) => (
  <Company store={store} {...props} />
);
