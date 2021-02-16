import React from "react";
import { store } from "./RegisterContainer";
import { LastName } from "../../SubComponents/LastName";

export const RegisterLastName = (props) => (
  <LastName store={store} {...props} />
);
