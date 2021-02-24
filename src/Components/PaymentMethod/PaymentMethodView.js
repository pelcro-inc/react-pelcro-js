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

export function PaymentMethodView({
  type,
  couponCode,
  successMessage,
  ReactGA,
  showCoupon,
  showExternalPaymentMethods,
  subscriptionIdToRenew,
  isRenewingGift,
  giftRecipient = null,
  plan,
  product,
  onSuccess,
  onGiftRenewalSuccess,
  onFailure,
  onDisplay,
  order = {}
}) {
  const { t } = useTranslation("checkoutForm");

  return (
    <div className="flex flex-col items-center mt-4 sm:px-8 pelcro-payment-block">
      <div className="flex w-full px-4 py-2 text-center text-green-600 border border-green-400 rounded bg-green-50">
        <LockIcon className="w-5 mr-1" />
        <span>
          {t("messages.youAreSafe")}
          <Link
            className="ml-1"
            target="_blank"
            href="https://www.stripe.com/us/customers"
          >
            Stripe
          </Link>
        </span>
      </div>

      <div className="w-full mt-2 font-semibold text-gray-600 pelcro-form">
        <PaymentMethodContainer
          type={type}
          successMessage={successMessage}
          ReactGA={ReactGA}
          subscriptionIdToRenew={subscriptionIdToRenew}
          isRenewingGift={isRenewingGift}
          giftRecipient={giftRecipient}
          plan={plan}
          product={product}
          couponCode={couponCode}
          onDisplay={onDisplay}
          onSuccess={onSuccess}
          onGiftRenewalSuccess={onGiftRenewalSuccess}
          onFailure={onFailure}
          order={order}
        >
          <AlertWithContext className="mb-2" />
          {/* Payment form */}
          <div>
            <PelcroCardNumber />
            <img
              alt="credit_cards"
              className="h-4 mt-2"
              src="https://js.pelcro.com/ui/plugin/main/images/credit_cards.png"
            />

            <div className="flex justify-between my-2">
              <div className="w-6/12 pr-4">
                <PelcroCardExpiry />
              </div>

              <div className="w-6/12 pl-4">
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
            <div className="grid mt-4 gap-y-2">
              <SubmitPaymentMethod />
              {showExternalPaymentMethods && (
                <>
                  <PelcroPaymentRequestButton />
                  <PaypalSubscribeButton
                    product={product}
                    plan={plan}
                  />
                </>
              )}
            </div>
          </div>
        </PaymentMethodContainer>
      </div>
    </div>
  );
}
