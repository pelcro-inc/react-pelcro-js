import React from "react";
import { store } from "./RegisterContainer";
import { Company } from "../../SubComponents/Company";

export const RegisterCompany = (props) => (
  <Company store={store} {...props} />
);
