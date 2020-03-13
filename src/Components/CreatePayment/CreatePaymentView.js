import React from "react";
import { useTranslation } from "react-i18next";
import { CheckoutFormView } from "../CheckoutForm/CheckoutFormView";
import ErrMessage from "../common/ErrMessage";
import AlertSuccess from "../common/AlertSuccess";

export const CreatePaymentView = () => {
  const { t } = useTranslation("messages");
  return (
    <div>
      <div className="pelcro-prefix-title-block">
        <h4>{this.product.paywall.subscribe_title}</h4>
        <p>
          {this.product.paywall.subscribe_subtitle} -{" "}
          {this.plan.amount_formatted}
          {this.plan.auto_renew && (
            <span>/({this.plan.interval_count})</span>
          )}{" "}
          {this.plan.interval}. {this.state.percentOff}
        </p>
      </div>

      <ErrMessage name="payment-create" />
      <AlertSuccess name="payment-create" />

      <div className="pelcro-prefix-payment-block">
        <div className="pelcro-prefix-alert pelcro-prefix-alert-success">
          <div className="pelcro-prefix-payment-message">
            <span>
              {t("youAreSafe")}{" "}
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
          <CheckoutFormView
            type="createPayment"
            enableCouponField={this.state.enableCouponField}
            showCouponField={this.showCouponField}
            couponCode={this.state.couponCode}
            showCoupon={true}
            onCouponCodeChange={this.onCouponCodeChange}
            onApplyCouponCode={this.onApplyCouponCode}
            plan={this.props.plan}
            coupon={this.state.coupon}
            subscriptionIdToRenew={this.props.subscriptionIdToRenew}
            giftRecipient={this.props.giftRecipient}
            product={this.props.product}
            setView={this.props.setView}
            resetView={this.props.resetView}
          />
        </div>
      </div>
    </div>
  );
};
