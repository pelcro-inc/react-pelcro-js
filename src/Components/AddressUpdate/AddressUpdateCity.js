import React from "react";
import { store } from "./AddressUpdateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressUpdateCity = (props) => {
  return <TextInput fieldName="city" {...props} store={store} />;
};
