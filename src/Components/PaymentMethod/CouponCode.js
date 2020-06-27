import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ApplyCouponButton } from "./ApplyCouponButton";
import { CouponCodeField } from "./CouponCodeField";
import { store } from "./PaymentMethodContainer";
import { SHOW_COUPON_FIELD } from "../../utils/action-types";

export const CouponCode = ({ showCoupon }) => {
  const {
    dispatch,
    state: { enableCouponField, disableCouponButton }
  } = useContext(store);

  const { t } = useTranslation("checkoutForm");

  const showCouponField = () =>
    dispatch({
      type: SHOW_COUPON_FIELD,
      payload: !enableCouponField
    });

  if (showCoupon) {
    return (
      <div>
        <button
          className="pelcro-prefix-link"
          type="button"
          onClick={showCouponField}
          style={!enableCouponField ? { marginBottom: 10 } : {}}
        >
          {!enableCouponField
            ? t("labels.addCode")
            : t("labels.hideCode")}
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
                <CouponCodeField />
              </div>
            </div>
            <div className="col-sm-12 apply-coupon-button">
              <div className="pelcro-prefix-input-wrapper">
                <ApplyCouponButton
                  disableCouponButton={disableCouponButton}
                >
                  {t("labels.applyCouponCode")}
                </ApplyCouponButton>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};
