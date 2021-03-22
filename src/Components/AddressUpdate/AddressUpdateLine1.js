import React from "react";
import { store } from "./AddressUpdateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressUpdateLine1 = (props) => {
  return <TextInput fieldName="line1" {...props} store={store} />;
};
