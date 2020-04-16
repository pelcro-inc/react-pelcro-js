import React from "react";
import { store } from "./AddressCreateContainer";
import { LastName } from "../../SubComponents/LastName";

export const AddressCreateLastName = (props) => (
  <LastName id="pelcro-user-first-name" store={store} {...props} />
);
