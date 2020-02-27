import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import { useTranslation } from "react-i18next";

import ErrMessage from "../common/ErrMessage";
import AlertSuccess from "../common/AlertSuccess";

import { CheckoutFormView } from "../CheckoutForm/CheckoutFormView";
import styles from "./styles.module.scss";

export function UpdatePaymentMethodView(props) {
  const [t] = useTranslation("paymentCreate");

  if (window.Stripe) {
    return (
      <React.Fragment>
        <div className="pelcro-prefix-title-block">
          <h4>{t("title")}</h4>
          <p>{t("subtitle")}</p>
        </div>

        <ErrMessage name="payment-create" />
        <AlertSuccess name="payment-create" />

        <div
          className={`${styles["pelcro-prefix-payment-block"]} pelcro-prefix-payment-block`}
        >
          <div className="pelcro-prefix-alert pelcro-prefix-alert-success">
            <div className="pelcro-prefix-payment-message">
              <span>
                {t("secure")}{" "}
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
            <StripeProvider
              apiKey={window.Pelcro.environment.stripe}
              stripeAccount={window.Pelcro.site.read().account_id}
            >
              <Elements>
                <CheckoutFormView
                  ReactGA={props.ReactGA}
                  successMessage={t("success")}
                  showCoupon={false}
                />
              </Elements>
            </StripeProvider>
          </div>
        </div>
      </React.Fragment>
    );
  }
  return null;
}
