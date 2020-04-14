import React from "react";
import { store } from "./AddressCreateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressTextInput = props => {
  return <TextInput {...props} store={store} />;
};
