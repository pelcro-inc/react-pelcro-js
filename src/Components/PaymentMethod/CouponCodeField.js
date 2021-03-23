import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodContainer";
import { UPDATE_COUPON_CODE } from "../../utils/action-types";
import { Input } from "../../SubComponents/Input";

export const CouponCodeField = (props) => {
  const { t } = useTranslation("checkoutForm");
  const {
    dispatch,
    state: { couponCode }
  } = useContext(store);

  const onCouponCodeChange = (e) =>
    dispatch({ type: UPDATE_COUPON_CODE, payload: e.target.value });

  return (
    <Input
      hideErrors={true}
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
