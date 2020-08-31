import React from "react";
import { store } from "./GiftRedeemContainer";
import { GiftCode } from "../../SubComponents/GiftCode";

export const GiftRedeemCode = (props) => (
  <GiftCode id="pelcro-gift-redeem-code" store={store} {...props} />
);
