import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ApplyCouponButton } from "./ApplyCouponButton";
import { CouponCodeField } from "./CouponCodeField";
import { store } from "./PaymentMethodContainer";
import { SHOW_COUPON_FIELD } from "../../utils/action-types";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as TicketIcon } from "../../assets/ticket.svg";

export const CouponCode = () => {
  const {
    dispatch,
    state: { enableCouponField }
  } = useContext(store);

  const { t } = useTranslation("checkoutForm");

  const showCouponField = () =>
    dispatch({
      type: SHOW_COUPON_FIELD,
      payload: !enableCouponField
    });

  return (
    <div className="my-4">
      <Button
        className="text-base text-gray-500"
        variant="ghost"
        icon={<TicketIcon className="w-5 mr-2" />}
        onClick={showCouponField}
      >
        {!enableCouponField
          ? t("labels.addCode")
          : t("labels.hideCode")}
      </Button>
      {enableCouponField && (
        <div className="flex w-full my-4 bg-gray-100 pelcro-apply-coupon-wrapper">
          <CouponCodeField />
          <ApplyCouponButton>
            {t("labels.applyCouponCode")}
          </ApplyCouponButton>
        </div>
      )}
    </div>
  );

  return null;
};
