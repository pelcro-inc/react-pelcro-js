import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import {
  SET_COUPON_ERROR,
  UPDATE_COUPON_CODE
} from "../../utils/action-types";
import { Input } from "../../SubComponents/Input";

export const CouponCodeField = (props) => {
  const { t } = useTranslation("checkoutForm");
  const {
    dispatch,
    state: { couponCode, couponError }
  } = useContext(store);

  const onCouponCodeChange = (e) => {
    dispatch({ type: UPDATE_COUPON_CODE, payload: e.target.value });

    if (couponError) {
      dispatch({ type: SET_COUPON_ERROR, payload: "" });
    }
  };

  return (
    <Input
      className="plc-h-10 plc-px-4 plc-rounded-lg plc-border plc-border-gray-300 plc-transition-all plc-duration-200 focus:plc-border-blue-500 focus:plc-ring-2 focus:plc-ring-blue-200 focus:plc-outline-none"
      wrapperClassName="plc-mb-6"
      errorClassName="plc-h-10 sm:plc-h-8"
      error={couponError}
      aria-label={t("labels.code")}
      value={couponCode}
      onChange={onCouponCodeChange}
      type="text"
      placeholder={t("labels.couponCode") || "Enter coupon code"}
      id="pelcro-input-coupon_code"
      {...props}
    />
  );
};
