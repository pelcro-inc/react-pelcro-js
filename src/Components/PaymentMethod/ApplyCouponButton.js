import React, { useContext } from "react";
import { Button } from "../../SubComponents/Button";
import { store } from "./PaymentMethodContainer";
import { APPLY_COUPON_CODE } from "../../utils/action-types";

export const ApplyCouponButton = ({ children }) => {
  const {
    state: { couponCode, disableCouponButton },
    dispatch
  } = useContext(store);

  const onApplyCouponCode = () =>
    dispatch({ type: APPLY_COUPON_CODE });

  return (
    <Button
      className="plc-text-sm plc-text-green-500 plc-uppercase plc-border plc-border-gray-300 disabled:plc-text-white disabled:plc-bg-gray-200 hover:plc-text-white plc-bg-gray-50"
      variant="outline"
      onClick={onApplyCouponCode}
      disabled={!couponCode || disableCouponButton}
    >
      {children}
    </Button>
  );
};
