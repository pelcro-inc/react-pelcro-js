import React from "react";
import { useTranslation } from "react-i18next";
import { PelcroCardCVC } from "../../SubComponents/PelcroCardCVC";
import { PelcroCardNumber } from "../../SubComponents/PelcroCardNumber";
import { PelcroCardExpiry } from "../../SubComponents/PelcroCardExpiry";
import { AlertDanger } from "../Alerts/AlertDanger";
import { AlertSuccess } from "../Alerts/AlertSuccess";
import { PelcroPaymentRequestButton } from "../../SubComponents/PelcroPaymentRequestButton";
import { DiscountedPrice } from "../PaymentMethod/DiscountedPrice";
import { SubscriptionCreateContainer } from "./SubscriptionCreateContainer";
import { SubmitPaymentMethod } from "../PaymentMethod/SubmitPaymentMethod";
import { CouponCode } from "../PaymentMethod/CouponCode";
import { PaypalSubscribeButton } from "../PaypalCheckout/PaypalSubscribeButton";

export const SubscriptionCreateView = ({
  product,
  plan,
  giftRecipient,
  onSuccess = () => {},
  onFailure = () => {},
  onDisplay = () => {}
}) => {
  const { t } = useTranslation("checkoutForm");
  const { t: tPayment } = useTranslation("payment");

  return (
    <div>
      <div className="pelcro-prefix-title-block">
        <h4>
          {product?.paywall?.subscribe_title ??
            window.Pelcro.paywall.read()?.subscribe_title}
        </h4>
        <p>
          {product?.paywall?.subscribe_subtitle ??
            window.Pelcro.paywall.read()?.subscribe_subtitle}{" "}
          - {plan?.amount_formatted}
          {plan?.auto_renew && (
            <span>/({plan?.interval_count})</span>
          )}{" "}
          {plan?.interval}.
        </p>
      </div>

      <AlertDanger name="payment-create" />
      <AlertSuccess name="payment-create" />

      <AlertDanger name="payment" />
      <AlertSuccess name="payment" />

      <div className="pelcro-prefix-payment-block">
        <div className="pelcro-prefix-alert pelcro-prefix-alert-success">
          <div className="pelcro-prefix-payment-message">
            <span>
              {tPayment("messages.youAreSafe")}{" "}
              <a
                className="pelcro-prefix-link"
                rel="nofollow"
                target="new"
                href="https://www.stripe.com/us/customers"
              >
                Stripe
              </a>{" "}
            </span>
          </div>
        </div>
        <div className="pelcro-prefix-form">
          <SubscriptionCreateContainer
            plan={plan}
            giftRecipient={giftRecipient}
            product={product}
            onDisplay={onDisplay}
            onFailure={onFailure}
            onSuccess={onSuccess}
          >
            <div className="pelcro-prefix-form">
              <div className="pelcro-prefix-row">
                <div className="col-md-12">
                  <label className="pelcro-prefix-label">
                    {t("labels.card")} *
                  </label>
                  <PelcroCardNumber />
                  <img
                    alt="credit_cards"
                    className={`pelcro-prefix-payment-icons`}
                    src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
                  />
                </div>

                <div className="col-md-6">
                  <label className="pelcro-prefix-label">
                    {t("labels.date")} *
                  </label>
                  <PelcroCardExpiry />
                </div>

                <div className="col-md-6">
                  <label className="pelcro-prefix-label">
                    {t("labels.CVC")} *
                  </label>
                  <PelcroCardCVC />
                </div>

                <div className="col-md-12">
                  <small className="pelcro-footnote form-text">
                    * {t("labels.required")}
                  </small>

                  <CouponCode showCoupon={true} />
                  <DiscountedPrice />

                  <SubmitPaymentMethod name={t("labels.submit")} />

                  <PelcroPaymentRequestButton />

                  <PaypalSubscribeButton
                    product={product}
                    plan={plan}
                  />
                </div>
              </div>
            </div>
          </SubscriptionCreateContainer>
        </div>
      </div>
    </div>
  );
};
