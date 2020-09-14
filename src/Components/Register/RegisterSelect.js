import React from "react";
import { store } from "./RegisterContainer";
import { Select } from "../../SubComponents/Select";

export const RegisterSelect = (props) => {
  return <Select {...props} store={store} />;
};
