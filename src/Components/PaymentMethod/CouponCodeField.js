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

    if (couponError.content) {
      dispatch({ type: SET_COUPON_ERROR, payload: "" });
    }
  };

  return (
    <Input
      className="plc-h-12"
      errorClassName="plc-mb-6"
      hideErrors={!couponError.content}
      error={couponError.content}
      aria-label={t("labels.code")}
      value={couponCode}
      onChange={onCouponCodeChange}
      type="text"
      placeholder={t("labels.codePlaceholder")}
      id="pelcro-input-coupon_code"
      {...props}
    />
  );
};
