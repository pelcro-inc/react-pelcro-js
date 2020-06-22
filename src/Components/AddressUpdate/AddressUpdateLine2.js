import React from "react";
import { store } from "./AddressUpdateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressUpdateLine2 = props => {
  return (
    <TextInput
      fieldName="line2"
      type="text"
      {...props}
      store={store}
    />
  );
};
