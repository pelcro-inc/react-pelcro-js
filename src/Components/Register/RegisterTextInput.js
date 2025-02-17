import React from "react";
import { store } from "./RegisterContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const RegisterTextInput = (props) => {
  return <TextInput {...props} store={store} />;
};
