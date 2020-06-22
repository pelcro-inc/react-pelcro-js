import React from "react";
import { store } from "./AddressCreateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressCreateLine1 = props => {
  return (
    <TextInput
      fieldName="line1"
      type="text"
      {...props}
      store={store}
    />
  );
};
