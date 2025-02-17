import React from "react";
import { store } from "./UserUpdateContainer";
import { Title } from "../../SubComponents/Title";

export const UserUpdateJobTitle = (props) => (
  <Title store={store} {...props} />
);
