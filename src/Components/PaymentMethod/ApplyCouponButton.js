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
      className="text-sm text-green-500 uppercase border border-gray-300 disabled:text-white disabled:bg-gray-200 hover:text-white bg-gray-50"
      variant="outline"
      onClick={onApplyCouponCode}
      disabled={!couponCode || disableCouponButton}
    >
      {children}
    </Button>
  );
};
