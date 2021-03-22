import React from "react";
import { store } from "./AddressCreateContainer";
import { TextInput } from "../../SubComponents/TextInput";

export const AddressCreateLine2 = (props) => {
  return <TextInput fieldName="line2" store={store} {...props} />;
};
