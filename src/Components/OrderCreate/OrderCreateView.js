import React from "react";
import { useTranslation } from "react-i18next";
import { OrderCreateContainer } from "./OrderCreateContainer";
import { OrderCraeteSubmitButton } from "./OrderCraeteSubmitButton";
import {
  PelcroCardNumber,
  PelcroCardExpiry,
  PelcroCardCVC,
  AlertDanger,
  CouponCode,
  DiscountedPrice
} from "../../components";

export const OrderCreateView = props => {
  const { t } = useTranslation("checkoutForm");
  const { t: tPayment } = useTranslation("payment");
  return (
    <div>
      <div className="pelcro-prefix-title-block">
        <h4>{tPayment("labels.checkout.title")}</h4>
      </div>

      <AlertDanger name="payment" />

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
          <OrderCreateContainer {...props}>
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

                  <OrderCraeteSubmitButton
                    name={t("labels.submit")}
                  />
                </div>
              </div>
            </div>
          </OrderCreateContainer>
        </div>
      </div>
    </div>
  );
};
