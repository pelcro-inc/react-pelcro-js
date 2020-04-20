import React from "react";
import { store } from "./AddressUpdateContainer";
import { StateSelect } from "../../SubComponents/StateSelect";

export const AddressUpdateStateSelect = (props) => (
  <StateSelect store={store} {...props} />
);
