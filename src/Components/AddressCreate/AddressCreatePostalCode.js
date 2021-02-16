import React from "react";
import { store } from "./AddressCreateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressCreatePostalCode = (props) => {
  return (
    <TextInput fieldName="postalCode" store={store} {...props} />
  );
};
