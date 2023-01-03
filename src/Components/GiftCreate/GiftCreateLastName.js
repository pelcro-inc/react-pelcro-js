import React from "react";
import { store } from "./GiftCreateContainer";
import { LastName } from "../../SubComponents/LastName";

export const GiftCreateLastName = (props) => (
  <LastName store={store} {...props} />
);
