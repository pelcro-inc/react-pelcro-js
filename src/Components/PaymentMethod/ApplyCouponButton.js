import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { store } from "./PaymentMethodContainer";
import { APPLY_COUPON_CODE } from "../../utils/action-types";
import { ReactComponent as ArrowLeftIcon } from "../../assets/arrow-left.svg";

export const ApplyCouponButton = ({ children }) => {
  const {
    state: { couponCode, disableCouponButton },
    dispatch
  } = useContext(store);
  const { t } = useTranslation("checkoutForm");

  const onApplyCouponCode = () =>
    dispatch({ type: APPLY_COUPON_CODE });

  return (
    <Button
      className="plc-pl-3 plc-pr-2 plc-ml-4 plc-text-sm plc-text-primary-500 disabled:plc-bg-gray-200"
      variant="solid"
      aria-label={t("labels.applyCouponCode")}
      icon={
        <ArrowLeftIcon className="plc-w-5 plc-transform plc-rotate-180" />
      }
      onClick={onApplyCouponCode}
      disabled={!couponCode || disableCouponButton}
    >
      {children}
    </Button>
  );
};
