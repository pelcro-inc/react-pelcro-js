import React, { useContext } from "react";
import { Button } from "../../SubComponents/Button";
import { store } from "./CheckoutFormContainer";

export const ApplyCouponButton = ({
  onApplyCouponCode,
  couponCode,
  disableCouponButton,
  name
}) => {
  const {
    state: { disableCouponButton: disableCouponButtonState }
  } = useContext(store);

  return (
    <Button
      className="pelcro-prefix-link"
      type="button"
      onClick={onApplyCouponCode}
      disabled={!couponCode || disableCouponButton || disableCouponButtonState}
    >
      {name}
    </Button>
  );
};
