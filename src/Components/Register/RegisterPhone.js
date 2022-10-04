import React from "react";
import { store } from "./RegisterContainer";
import { Phone } from "./../../SubComponents/Phone";

export const RegisterPhone = (props) => (
  <Phone store={store} {...props} />
);
