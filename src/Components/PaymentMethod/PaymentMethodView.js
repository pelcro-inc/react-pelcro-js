import React from "react";
import {
  PelcroPaymentRequestButton,
  CheckoutForm
} from "../../SubComponents/StripeElements";
import { useTranslation } from "react-i18next";
import { DiscountedPrice } from "./DiscountedPrice";
import { PaymentMethodContainer } from "./PaymentMethodContainer";
import { SubmitPaymentMethod } from "./SubmitPaymentMethod";
import { CouponCode } from "./CouponCode";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { PaypalSubscribeButton } from "../PaypalButtons/PaypalSubscribeButton";
import { BankRedirection } from "./BankRedirection";
import { Link } from "../../SubComponents/Link";
import { ReactComponent as LockIcon } from "../../assets/lock.svg";
import { SelectedPaymentMethod } from "./SelectedPaymentMethod";
import { TaxAmount } from "./TaxAmount";

/**
 *
 */
export function PaymentMethodView({
  onSuccess,
  onGiftRenewalSuccess,
  onFailure,
  type,
  showCoupon,
  showExternalPaymentMethods
}) {
  const { t } = useTranslation("checkoutForm");

  return (
    <div className="plc-flex plc-flex-col plc-items-center plc-mt-4 sm:plc-px-8 pelcro-payment-block">
      <div className="plc-flex plc-items-center plc-w-full plc-px-4 plc-py-2 plc-text-center plc-text-green-600 plc-border plc-border-green-400 plc-rounded plc-bg-green-50">
        <LockIcon className="plc-w-5 plc-h-5 plc-mr-1" />
        <span>
          {t("messages.youAreSafe")}
          <Link
            className="plc-ml-1"
            target="_blank"
            href="https://www.stripe.com/us/customers"
            isButton={false}
          >
            Stripe
          </Link>
        </span>
      </div>

      <form
        action="javascript:void(0);"
        className="plc-w-full plc-mt-2 plc-font-semibold plc-text-gray-600 pelcro-form"
      >
        <PaymentMethodContainer
          type={type}
          onSuccess={onSuccess}
          onGiftRenewalSuccess={onGiftRenewalSuccess}
          onFailure={onFailure}
        >
          <BankRedirection />
          <AlertWithContext className="plc-mb-2" />
          {/* Payment form */}
          <div>
            <SelectedPaymentMethod />
            <CheckoutForm />

            {/* Coupon section */}
            {showCoupon && (
              <div className="plc-mb-2">
                <CouponCode />
                <DiscountedPrice />
              </div>
            )}

            <TaxAmount />

            {/* Payment buttons section */}
            <div className="plc-grid plc-mt-4 plc-gap-y-2">
              <SubmitPaymentMethod />
              {showExternalPaymentMethods && (
                <>
                  <PelcroPaymentRequestButton />
                  <PaypalSubscribeButton />
                </>
              )}
            </div>
          </div>
        </PaymentMethodContainer>
      </form>
    </div>
  );
}
