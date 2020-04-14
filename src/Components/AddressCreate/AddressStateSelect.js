import React from "react";
import { store } from "./AddressCreateContainer";
import { StateSelect } from "../../SubComponents/StateSelect";

export const AddressStateSelect = props => (
  <StateSelect store={store} {...props} />
);
