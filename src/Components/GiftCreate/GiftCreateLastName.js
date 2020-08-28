import React from "react";
import { store } from "./GiftCreateContainer";
import { LastName } from "../../SubComponents/LastName";

export const GiftCreateLastName = (props) => (
  <LastName
    id="pelcro-gift-create-last-name"
    store={store}
    {...props}
  />
);
