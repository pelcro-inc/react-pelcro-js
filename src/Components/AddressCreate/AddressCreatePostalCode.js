import React from "react";
import { store } from "./AddressCreateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressCreatePostalCode = props => {
  return (
    <TextInput
      fieldName="postalCode"
      type="text"
      {...props}
      store={store}
    />
  );
};
