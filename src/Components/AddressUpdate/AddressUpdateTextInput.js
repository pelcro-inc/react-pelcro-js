import React from "react";
import { store } from "./AddressUpdateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressUpdateTextInput = (props) => {
  return <TextInput {...props} store={store} />;
};
