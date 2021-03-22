import React from "react";
import { store } from "./AddressUpdateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressUpdatePostalCode = (props) => {
  return (
    <TextInput fieldName="postalCode" {...props} store={store} />
  );
};
