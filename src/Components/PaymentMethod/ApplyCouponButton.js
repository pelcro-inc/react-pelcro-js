import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { store } from "./PaymentMethodContainer";
import { APPLY_COUPON_CODE } from "../../utils/action-types";
import { ReactComponent as ArrowLeftIcon } from "../../assets/arrow-left.svg";

export const ApplyCouponButton = ({
  children,
  onClick,
  ...otherProps
}) => {
  const {
    state: { couponCode, disableCouponButton },
    dispatch
  } = useContext(store);
  const { t } = useTranslation("checkoutForm");

  const onApplyCouponCode = () => {
    dispatch({ type: APPLY_COUPON_CODE });
    onClick?.();
  };

  return (
    <button
      className="plc-h-10 plc-ml-4 plc-w-24 
       plc-bg-primary-600 plc-text-white plc-rounded-lg plc-font-medium plc-transition-all plc-duration-200 plc-hover:plc-bg-primary-600 plc-disabled:plc-bg-gray-300 plc-disabled:plc-text-gray-900"
      onClick={onApplyCouponCode}
      disabled={!couponCode || disableCouponButton}
      {...otherProps}
    >
      {children}
    </button>
  );
};
