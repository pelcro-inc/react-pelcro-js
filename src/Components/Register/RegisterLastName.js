import React from "react";
import { store } from "./RegisterContainer";
import { LastName } from "../../SubComponents/LastName";

export const RegisterLastName = (props) => (
  <LastName id="pelcro-register-last-name" store={store} {...props} />
);
