import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ApplyCouponButton } from "./ApplyCouponButton";
import { CouponCodeField } from "./CouponCodeField";
import { store } from "./PaymentMethodContainer";
import { SHOW_COUPON_FIELD } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as TicketIcon } from "../../assets/ticket.svg";

export const CouponCode = ({ onClick, ...otherProps }) => {
  const {
    dispatch,
    state: { enableCouponField }
  } = useContext(store);

  const { t } = useTranslation("checkoutForm");

  const showCouponField = () => {
    dispatch({
      type: SHOW_COUPON_FIELD,
      payload: !enableCouponField
    });
    onClick?.();
  };

  return (
    <div className="plc-mt-4 plc-mb-6">
      <Button
        className="plc-mb-2 plc-text-base plc-text-gray-500"
        variant="ghost"
        icon={<TicketIcon className="plc-w-5 plc-h-5 plc-mr-2" />}
        onClick={showCouponField}
        {...otherProps}
      >
        {!enableCouponField
          ? t("labels.addCode")
          : t("labels.hideCode")}
      </Button>
      {enableCouponField && (
        <div className="plc-flex plc-w-full plc-mt-2 pelcro-apply-coupon-wrapper">
          <CouponCodeField />
          <ApplyCouponButton />
        </div>
      )}
    </div>
  );
};
