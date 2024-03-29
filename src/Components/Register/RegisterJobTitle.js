import React from "react";
import { store } from "./RegisterContainer";
import { Title } from "../../SubComponents/Title";

export const RegisterJobTitle = (props) => (
  <Title store={store} {...props} />
);
