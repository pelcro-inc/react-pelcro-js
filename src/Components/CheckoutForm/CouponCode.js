import React from "react";
import { useTranslation } from "react-i18next";
import { ApplyCouponButton } from "./ApplyCouponButton";

export const CouponCode = ({
  showCouponField,
  enableCouponField,
  couponCode,
  onCouponCodeChange,
  onApplyCouponCode,
  disableCouponButton,
  showCoupon
}) => {
  const { t } = useTranslation("checkoutForm");

  if (showCoupon) {
    return (
      <div>
        <button
          className="pelcro-prefix-link"
          type="button"
          onClick={showCouponField}
          style={!enableCouponField ? { marginBottom: 10 } : {}}
        >
          {!enableCouponField ? t("labels.addCode") : t("labels.hideCode")}
        </button>
        {enableCouponField && (
          <div className="pelcro-prefix-row">
            <div className="col-sm-12">
              <div className="pelcro-prefix-input-wrapper">
                <label
                  className="pelcro-prefix-label"
                  htmlFor="pelcro-input-coupon_code"
                >
                  {t("labels.code")}
                </label>
                <input
                  value={couponCode}
                  onChange={onCouponCodeChange}
                  className="pelcro-prefix-input pelcro-prefix-form-control"
                  type="text"
                  placeholder={t("labels.codePlaceholder")}
                  id="pelcro-input-coupon_code"
                />
              </div>
            </div>
            <div className="col-sm-12 apply-coupon-button">
              <div className="pelcro-prefix-input-wrapper">
                <ApplyCouponButton
                  onApplyCouponCode={onApplyCouponCode}
                  couponCode={couponCode}
                  disableCouponButton={disableCouponButton}
                  name={t("labels.applyCouponCode")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
