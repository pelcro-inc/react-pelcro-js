import React from "react";
import {
  PelcroCardNumber,
  PelcroCardExpiry,
  PelcroCardCVC,
} from "../../components";
import { useTranslation } from "react-i18next";
import { DiscountedPrice } from "./DiscountedPrice";
import { CheckoutFormContainer } from "./CheckoutFormContainer";
import { SubmitCheckoutForm } from "./SubmitCheckoutForm";
import { CouponCode } from "./CouponCode";

export function CheckoutFormView({
  enableCouponField,
  showCouponField,
  couponCode,
  onCouponCodeChange,
  onApplyCouponCode,
  disableCouponButton,
  successMessage,
  ReactGA,
  showCoupon,
  type,
  subscriptionIdToRenew,
  giftRecipient,
  plan,
  product,
  setView,
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
    <CheckoutFormContainer
      type={type}
      successMessage={successMessage}
      ReactGA={ReactGA}
      subscriptionIdToRenew={subscriptionIdToRenew}
      giftRecipient={giftRecipient}
      plan={plan}
      product={product}
      couponCode={couponCode}
      setView={setView}
    >
      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label className="pelcro-prefix-label">{t("labels.card")} *</label>
            <PelcroCardNumber />
            <img
              alt="credit_cards"
              className={`pelcro-prefix-payment-icons`}
              src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
            />
          </div>

          <div className="col-md-6">
            <label className="pelcro-prefix-label">{t("labels.date")} *</label>
            <PelcroCardExpiry />
          </div>

          <div className="col-md-6">
            <label className="pelcro-prefix-label">{t("labels.CVC")} *</label>
            <PelcroCardCVC />
          </div>

          <div className="col-md-12">
            <small className="pelcro-footnote form-text">
              * {t("labels.required")}
            </small>

            <CouponCode showCoupon={showCoupon} />
            <DiscountedPrice />

            <SubmitCheckoutForm name={t("labels.submit")} />
          </div>
        </div>
      </div>
    </CheckoutFormContainer>
  );
}
