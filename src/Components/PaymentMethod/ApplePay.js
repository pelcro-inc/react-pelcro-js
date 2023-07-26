import React, { useEffect, useContext } from "react";
import { store } from "./PaymentMethodContainer";
import { getAddressById } from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";

export const ApplePayButton = ({ onClick, props, ...otherProps }) => {
  const { dispatch, state } = useContext(store);
  const { product, plan, invoice, selectedAddressId } = usePelcro();

  const updatedPrice =
    state.updatedPrice ??
    props?.plan?.amount ??
    plan?.amount ??
    invoice.amount_remaining;

  const selectedAddress = getAddressById(
    props?.selectedAddressId ?? selectedAddressId
  );

  function onApplePayButtonClicked() {
    if (!ApplePaySession) {
      return;
    }

    if (window.ApplePaySession) {

      // @todo - Should not be hardcoded
      const merchantIdentifier = "merchant.pelcro.prelive";

      // Indicates whether the device supports Apple Pay and whether the user has an active card in Wallet.
      const promise = ApplePaySession.canMakePaymentsWithActiveCard(
        merchantIdentifier
      );
      promise.then(function (canMakePayments) {
        if (canMakePayments)
          // Display Apple Pay Buttons here…
          console.log("canMakePayments", canMakePayments);
      });
    }

    // Define ApplePayPaymentRequest
    // @see https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/creating_an_apple_pay_session
    const request = {
      countryCode: "US",
      currencyCode: "USD",
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      total: {
        label: "Demo (Card is not charged)",
        type: "final",
        amount: "1.99"
      }
    };

    // Create ApplePaySession
    // @todo - Clarify supported version parameter
    // @odo - Apple Pay demo uses version 6 (https://applepaydemo.apple.com/)
    const session = new ApplePaySession(3, request);

    // @todo - Detect whether web browser supports a particular Apple Pay version.
    // @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession/1778014-supportsversion

    session.onvalidatemerchant = async (event) => {
      // Call your own server to request a new merchant session.
      const { validationURL } = event;
      fetch(
        "https://pelcro-khairy.eu.ngrok.io/api/v1/sdk/payment/applePay/startSession",
        {
          method: "POST",
          body: JSON.stringify({
            site_id: "3",
            validation_url: validationURL
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3BlbGNyby1raGFpcnkuZXUubmdyb2suaW8vYXBpL3YxL3Nkay9hdXRoL3JlZ2lzdGVyIiwiaWF0IjoxNjg5ODc3ODA5LCJleHAiOjE2OTUwNjE4MDksIm5iZiI6MTY4OTg3NzgwOSwianRpIjoia3hnUUVBcTQzV3Y4ZFpocyIsInN1YiI6IjcwMCIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.sMvNOauOwCxV-otM3nxBL6JK-o-mY-7fB0EB79TCGBY"
          }
        }
      )
        .then(function (response) {
          if (!response.ok) {
            console.error(
              "Merchant validation failed:",
              response.status
            );
            throw new Error("Merchant validation failed");
          }
          return response.json();
        })
        .then(function (merchantSession) {
          console.log("gowa el then merchantsession step", event);
          console.log("merchant session object", merchantSession);
          // Complete merchant validation with the merchant session object
          session.completeMerchantValidation(merchantSession);
        })
        .catch(function (error) {
          console.error("Merchant validation error:", error);
          // Handle any errors during merchant validation
          session.abort();
        });
    };

    session.onpaymentmethodselected = (event) => {
      console.log("gowa el payment method selected step", event);
      // Define ApplePayPaymentMethodUpdate based on the selected payment method.
      // No updates or errors are needed, pass an empty object.
      const update = {};
      session.completePaymentMethodSelection(update);
    };

    session.onshippingmethodselected = (event) => {
      console.log("gowa el on shipping method selected step", event);
      // Define ApplePayShippingMethodUpdate based on the selected shipping method.
      // No updates or errors are needed, pass an empty object.
      const update = {};
      session.completeShippingMethodSelection(update);
    };

    session.onshippingcontactselected = (event) => {
      console.log("gowa el on shipping contact selected step", event);
      // Define ApplePayShippingContactUpdate based on the selected shipping contact.
      const update = {};
      session.completeShippingContactSelection(update);
    };

    session.onpaymentauthorized = (event) => {
      console.log("gowa el on payment authorized step", event);
      // Define ApplePayPaymentAuthorizationResult
      const result = {
        status: ApplePaySession.STATUS_SUCCESS
      };
      session.completePayment(result);
    };

    session.oncouponcodechanged = (event) => {
      console.log("gowa el on coupon code changed step", event);
      // Define ApplePayCouponCodeUpdate
      const newTotal = calculateNewTotal(event.couponCode);
      const newLineItems = calculateNewLineItems(event.couponCode);
      const newShippingMethods = calculateNewShippingMethods(
        event.couponCode
      );
      const errors = calculateErrors(event.couponCode);

      session.completeCouponCodeChange({
        newTotal: newTotal,
        newLineItems: newLineItems,
        newShippingMethods: newShippingMethods,
        errors: errors
      });
    };

    session.oncancel = (event) => {
      console.log("gowa el on cancel step", event);
      // Payment cancelled by WebKit
    };

    session.begin();
  }

  useEffect(() => {
    const pelcroApplyPayButton = document.getElementById(
      "pelcro-apple-pay-button"
    );
    if (pelcroApplyPayButton) {
      pelcroApplyPayButton.addEventListener(
        "click",
        onApplePayButtonClicked
      );
    }
  }, []);

  return (
    <apple-pay-button
      id="pelcro-apple-pay-button"
      buttonstyle="black"
      type="plain"
      locale="en-US"
    ></apple-pay-button>
  );
};
