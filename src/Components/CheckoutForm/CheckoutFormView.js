import React from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement
} from "react-stripe-elements";
import { useTranslation } from "react-i18next";
import styles from "../UpdatePaymentMethod/styles.module.scss";
import { CheckoutFormContainer } from "./CheckoutFormContainer";
import { SubmitCheckoutForm } from "./SubmitCheckoutForm";
import { ApplyCouponButton } from "./ApplyCouponButton";

export function CheckoutFormView({
  enableCouponField,
  showCouponField,
  couponCode,
  onCouponCodeChange,
  disableCouponButton,
  successMessage,
  ReactGA
}) {
  // componentDidUpdate(prevProps) {
  //   if (prevProps.coupon !== this.props.coupon)
  //     if (
  //       this.props.coupon.duration === "forever" &&
  //       this.props.coupon.percent_off === 100
  //     ) {
  //       this.setState({ disableCouponButton: true });
  //       this.props.setDisableSubmitState(true);
  //       this.props.callback({});
  //     }
  // }

  const { t } = useTranslation("checkoutForm");

  return (
    <CheckoutFormContainer successMessage={successMessage} ReactGA={ReactGA}>
      <div className="pelcro-prefix-form" ref="form">
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label className="pelcro-prefix-label">{t("labels.card")} *</label>
            <CardNumberElement />
            <img
              alt="credit_cards"
              className={`${styles["pelcro-prefix-payment-icons"]} pelcro-prefix-payment-icons`}
              src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
            />
          </div>

          <div className="col-md-6">
            <label className="pelcro-prefix-label">{t("labels.date")} *</label>
            <CardExpiryElement />
          </div>

          <div className="col-md-6">
            <label className="pelcro-prefix-label">{t("labels.CVC")} *</label>
            <CardCVCElement />
          </div>

          <div className="col-md-12">
            <small className="pelcro-footnote form-text">
              * {t("labels.required")}
            </small>

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
                        couponCode={couponCode}
                        disableCouponButton={disableCouponButton}
                        name={t("labels.applyCouponCode")}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <SubmitCheckoutForm name={t("labels.submit")} />
          </div>
        </div>
      </div>
    </CheckoutFormContainer>
  );
}
