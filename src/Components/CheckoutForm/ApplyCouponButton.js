import React, { useContext } from "react";
import { Button } from "../../SubComponents/Button";
import { store } from "./CheckoutFormContainer";
import {} from "../../utils/action-types";

export const ApplyCouponButton = ({
  onApplyCouponCode,
  couponCode,
  disableCouponButton,
  name
}) => {
  const {
    state: { disableCouponButton: disableCouponButtonState },
    dispatch
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
