import React from "react";
import { store } from "./AddressCreateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressCreateCity = props => {
  return (
    <TextInput
      fieldName="city"
      type="text"
      {...props}
      store={store}
    />
  );
};
