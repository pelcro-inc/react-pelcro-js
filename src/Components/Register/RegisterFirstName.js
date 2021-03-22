import React from "react";
import { store } from "./RegisterContainer";
import { FirstName } from "../../SubComponents/FirstName";

export const RegisterFirstName = (props) => (
  <FirstName store={store} {...props} />
);
