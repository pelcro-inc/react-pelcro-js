import React from "react";
import { store } from "./UserUpdateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const UserUpdateTextInput = props => {
  return <TextInput {...props} store={store} />;
};
