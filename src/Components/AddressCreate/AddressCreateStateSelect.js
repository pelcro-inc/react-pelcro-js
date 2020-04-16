import React from "react";
import { store } from "./AddressCreateContainer";
import { StateSelect } from "../../SubComponents/StateSelect";

export const AddressCreateStateSelect = (props) => (
  <StateSelect store={store} {...props} />
);
