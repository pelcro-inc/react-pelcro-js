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
import { getSiteCardProcessor } from "../../Components/common/Helpers";
import { IncludeFirstName } from "./IncludeFirstName";
import { IncludeLastName } from "./IncludeLastName";
import { IncludePhone } from "./IncludePhone";
import { SubscriptionCreateFreePlanButton } from "../SubscriptionCreate/SubscriptionCreateFreePlanButton";
import { BankAuthenticationSuccess } from "./BankAuthenticationSuccess";
import { OrderCreateFreeButton } from "../OrderCreate/OrderCreateFreeButton";
import {
  calcAndFormatItemsTotal,
  getFormattedPriceByLocal,
  getPageOrDefaultLanguage
} from "../../utils/utils";
import { ApplePayButton } from "../ApplePayButton/ApplePayButton";
import { PaymentMethodUpdateSetDefault } from "../PaymentMethodUpdate/PaymentMethodUpdateSetDefault";
import { SelectedAddress } from "./SelectedAddress";
import { HANDLE_APPLEPAY_SHOW } from "../../utils/action-types";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *@return {paymentMethodView}
 */
export function PaymentMethodView({
  onSuccess,
  onGiftRenewalSuccess,
  onFailure,
  type,
  showCoupon,
  showExternalPaymentMethods,
  showSubscriptionButton,
  showOrderButton,
  showApplePayButton,
  order,
  isSubmitDisabled,
  ...props
}) {
  const { t } = useTranslation("checkoutForm");
  const cardProcessor = getSiteCardProcessor();
  const { site, user } = usePelcro();

  const vantivSettings = window.Pelcro.site.read()?.vantiv_gateway_settings;
  const supportsVantiv = Boolean(vantivSettings);
  const isApplePayEnabled = Boolean(vantivSettings?.apple_pay_enabled);
  const hasApplePayMerchantId = Boolean(vantivSettings?.apple_pay_merchant_id);

  const supportsTap = Boolean(
    window.Pelcro.site.read()?.tap_gateway_settings
  );

  const supportsCybersource = Boolean(
    window.Pelcro.site.read()?.cybersource_gateway_settings
  );

  const isUserFirstName = Boolean(
    window.Pelcro.user.read().first_name
  );
  const isUserLastName = Boolean(window.Pelcro.user.read().last_name);
  const isUserPhone = Boolean(window.Pelcro.user.read().phone);

  const handleApplePayButtonClick = (event) => {
    if (!event.isTrusted) return;
    
    event.preventDefault();
    
    dispatch({
      type: HANDLE_APPLEPAY_SHOW,
      payload: {
        amount: updatedPrice ?? currentPlan?.amount ?? 0,
        currency: currentPlan?.currency,
        label: currentPlan?.nickname || currentPlan?.description || 'Subscription'
      }
    });
  };

  const handleAddressCreated = (data) => {
    if (!data) return;
    
    try {
      window.Pelcro.insight.track("Customer Address Created", {
        platform: "views"
      });
      
      if (window.Pelcro.user.set && typeof window.Pelcro.user.set === 'function') {
        window.Pelcro.user.set(data);
      }
      
      const event = new CustomEvent('addressCreated', { detail: { data } });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Error handling address creation:', error);
    }
  };

  // Add WordPress specific checks
  const isApplePayAvailableForWordPress = () => {
    const isWordPress = window?.Pelcro?.uiSettings?.platform === 'wordpress';
    if (!isWordPress) return true; // Not WordPress, proceed normally

    const vantivSettings = window?.Pelcro?.site?.read()?.vantiv_gateway_settings;
    return Boolean(
      vantivSettings?.apple_pay_enabled &&
      vantivSettings?.apple_pay_merchant_id &&
      window.ApplePaySession?.canMakePayments()
    );
  };

  return (
    <div className="plc-flex plc-flex-col plc-items-center plc-mt-4 plc-px-8 md:plc-px-0 pelcro-payment-block">
      {/* {order && (
        <div className="plc-w-full plc-p-2 plc-mb-4 plc-font-semibold plc-text-center plc-text-gray-900 plc-bg-gray-100 plc-border plc-border-gray-200">
          <p className="plc-text-gray-600">
            <span className="plc-tracking-wider plc-uppercase">
              {t("labels.amount")}
            </span>
            <br />
            <span className="plc-text-xl plc-font-semibold plc-text-primary-600">
              {calcAndFormatItemsTotal(order, order[0]?.currency) ??
                getFormattedPriceByLocal(
                  order?.price,
                  order?.currency,
                  getPageOrDefaultLanguage()
                )}
            </span>
          </p>
        </div>
      )} */}
      {cardProcessor === "stripe" &&
        !showSubscriptionButton &&
        !showOrderButton && (
          <div className="plc-flex plc-items-center plc-w-full plc-px-4 plc-py-2 plc-text-center plc-text-green-600 plc-border plc-border-green-400 plc-rounded plc-bg-green-50 pelcro-stripe-compliance">
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
        )}

      <form
        action="javascript:void(0);"
        className="plc-w-full plc-mt-2 plc-font-semibold plc-text-gray-600 pelcro-form"
      >
        <PaymentMethodContainer
          type={type}
          onSuccess={onSuccess}
          onGiftRenewalSuccess={onGiftRenewalSuccess}
          onFailure={onFailure}
          freeOrders={showOrderButton}
          {...props}
        >
          <AlertWithContext className="plc-mb-2" />
          {/* Payment form */}
          {showSubscriptionButton && (
            <SubscriptionCreateFreePlanButton />
          )}

          {showOrderButton && <OrderCreateFreeButton />}

          {!showSubscriptionButton && !showOrderButton && (
            <div>
              <BankRedirection />
              <BankAuthenticationSuccess />
              {/* TODO: display selected address only if stripe BACS is enabled */}
              <SelectedAddress type={type} />
              <SelectedPaymentMethod />

              {supportsTap &&
                (!isUserFirstName ||
                  !isUserLastName ||
                  !isUserPhone) && (
                  <>
                    <div className="plc-flex plc-items-start">
                      <IncludeFirstName
                        id="pelcro-input-first-name"
                        label={t("labels.firstName")}
                        errorId="pelcro-input-firstName-error"
                        required
                      />
                      <IncludeLastName
                        wrapperClassName="plc-ml-3"
                        id="pelcro-input-last-name"
                        label={t("labels.lastName")}
                        errorId="pelcro-input-lastName-error"
                        required
                      />
                    </div>

                    <IncludePhone
                      id="pelcro-input-phone"
                      errorId="pelcro-input-phone-error"
                      label={t("labels.phone")}
                      required
                    />
                  </>
                )}

              <CheckoutForm type={type} />

              {/* Coupon section */}
              {showCoupon && (
                <div className="plc-mb-2">
                  <CouponCode />
                  <DiscountedPrice />
                </div>
              )}

              <TaxAmount />

              {type === "updatePaymentSource" && (
                <PaymentMethodUpdateSetDefault
                  id="pelcro-input-is-default"
                  label={t("labels.isDefault")}
                />
              )}

              {/* Payment buttons section */}
              <div className="plc-grid plc-mt-4 plc-gap-y-2">
                <SubmitPaymentMethod
                  isSubmitDisabled={isSubmitDisabled}
                />
                {showExternalPaymentMethods &&
                !supportsVantiv &&
                !supportsCybersource &&
                !supportsTap ? (
                  <>
                    <PelcroPaymentRequestButton />
                    <PaypalSubscribeButton />
                  </>
                ) : showExternalPaymentMethods && supportsVantiv ? (
                  <>
                    <PaypalSubscribeButton />
                  </>
                ) : null}
                {showApplePayButton && isApplePayAvailableForWordPress() && (
                  <div className="plc-mt-4">
                    <button
                      id="pelcro-apple-pay-button"
                      onClick={handleApplePayButtonClick}
                      className="plc-w-full plc-py-3 plc-bg-black plc-text-white plc-rounded"
                      type="button"
                    >
                      Pay with Apple Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </PaymentMethodContainer>
      </form>
    </div>
  );
}
