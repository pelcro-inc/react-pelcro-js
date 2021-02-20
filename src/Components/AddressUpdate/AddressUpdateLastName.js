import React from "react";
import { store } from "./AddressUpdateContainer";
import { LastName } from "../../SubComponents/LastName";

export const AddressUpdateLastName = (props) => (
  <LastName store={store} {...props} />
);
