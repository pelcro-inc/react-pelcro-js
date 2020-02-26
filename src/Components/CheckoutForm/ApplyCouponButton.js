import React from "react";
import { Button } from "../../SubComponents/Button";

export const ApplyCouponButton = ({
  onApplyCouponCode,
  couponCode,
  disableCouponButton,
  name
}) => {
  return (
    <Button
      className="pelcro-prefix-link"
      type="button"
      onClick={onApplyCouponCode}
      disabled={!couponCode || disableCouponButton}
    >
      {name}
    </Button>
  );
};
