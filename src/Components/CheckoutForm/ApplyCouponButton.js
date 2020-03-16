import React, { useContext } from "react";
import { Button } from "../../SubComponents/Button";
import { store } from "./CheckoutFormContainer";
import { APPLY_COUPON_CODE } from "../../utils/action-types";

export const ApplyCouponButton = ({ children }) => {
  const {
    state: {
      disableCouponButton: disableCouponButtonState,
      couponCode,
      disableCouponButton
    },
    dispatch
  } = useContext(store);

  const onApplyCouponCode = () => dispatch({ type: APPLY_COUPON_CODE });

  return (
    <Button
      className="pelcro-prefix-link"
      type="button"
      onClick={onApplyCouponCode}
      disabled={!couponCode || disableCouponButton || disableCouponButtonState}
    >
      {children}
    </Button>
  );
};
