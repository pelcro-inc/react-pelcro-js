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
    <div className="plc-text-left">
      <Button
        className="plc-text-base plc-text-gray-900  plc-underline"
        variant="ghost"
        icon={<TicketIcon className="plc-w-5 plc-h-5 plc-mr-2  plc-underline"  />}
        onClick={showCouponField}
        {...otherProps}
      >
        {!enableCouponField
          ? t("labels.addCode")
          : t("labels.hideCode")}
      </Button>
      {enableCouponField && (
        <div className="plc-flex plc-max-w-full pelcro-apply-coupon-wrapper plc-px-8">
          <CouponCodeField />
          <ApplyCouponButton >
            {t('labels.applyCouponCode')}
          </ApplyCouponButton>
        </div>
      )}
    </div>
  );
};
