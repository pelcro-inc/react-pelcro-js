import React from "react";
import {
  PelcroCardNumber,
  PelcroCardExpiry,
  PelcroCardCVC,
  PelcroPaymentRequestButton
} from "../../SubComponents/StripeElements";
import { useTranslation } from "react-i18next";
import { DiscountedPrice } from "./DiscountedPrice";
import { PaymentMethodContainer } from "./PaymentMethodContainer";
import { SubmitPaymentMethod } from "./SubmitPaymentMethod";
import { CouponCode } from "./CouponCode";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { PaypalSubscribeButton } from "../PaypalButtons/PaypalSubscribeButton";
import { Link } from "../../SubComponents/Link";
import { ReactComponent as LockIcon } from "../../assets/lock.svg";
import { ReactComponent as SpinnerIcon } from "../../assets/spinner.svg";

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
          <div className="plc-absolute plc-inset-0 plc-flex-col plc-items-center plc-justify-center plc-hidden plc-text-lg plc-bg-white plc-z-max plc-text-primary-500 card-authentication-container">
            {t("messages.bankRedirection")}
            <SpinnerIcon className="plc-w-10 plc-h-10 plc-mt-5 plc-animate-spin" />
          </div>
          <AlertWithContext className="plc-mb-2" />
          {/* Payment form */}
          <div>
            <PelcroCardNumber autoFocus={true} />
            <img
              alt="credit_cards"
              className="plc-h-4 plc-mt-2"
              src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
            />

            <div className="plc-flex plc-justify-between plc-my-2">
              <div className="plc-w-6/12 plc-pr-4">
                <PelcroCardExpiry />
              </div>

              <div className="plc-w-6/12 plc-pl-4">
                <PelcroCardCVC />
              </div>
            </div>

            {/* Coupon section */}
            {showCoupon && (
              <>
                <CouponCode />
                <DiscountedPrice />
              </>
            )}

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
