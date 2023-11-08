import React, { useEffect, useContext } from "react";
import { store } from "../PaymentMethod/PaymentMethodContainer";
import { getErrorMessages } from "../common/Helpers";
import { usePelcro } from "../../hooks/usePelcro";
import {
  HANDLE_APPLEPAY_SUBSCRIPTION,
  SHOW_ALERT,
  LOADING,
  DISABLE_SUBMIT
} from "../../utils/action-types";

/**
 * ApplePayButton component
 * @return {JSX}
 */
export const ApplePayButton = ({ onClick, props, ...otherProps }) => {
  const { dispatch, state } = useContext(store);
  const { plan, invoice, order } = usePelcro();
  const {
    pay_page_id: payPageId,
    report_group: reportGroup,
    apple_pay_merchant_id: ApplePayMerchantId,
    apple_pay_enabled: ApplePayEnabled
  } = window.Pelcro.site.read()?.vantiv_gateway_settings;

  const getOrderInfo = () => {
    if (!order) {
      return {
        price: null,
        currency: null,
        label: null
      };
    }

    const isQuickPurchase = !Array.isArray(order);

    if (isQuickPurchase) {
      return {
        price: order.price * order.quantity,
        currency: order.currency,
        label: order.name
      };
    }

    if (order.length === 0) {
      return {
        price: null,
        currency: null,
        label: null
      };
    }

    const price = order.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    return {
      price,
      currency: order[0].currency,
      label: "Order"
    };
  };

  const orderPrice = getOrderInfo().price;

  const orderCurrency = getOrderInfo().currency;

  const orderLabel = getOrderInfo().label;

  useEffect(() => {
    if (window.ApplePaySession) {
      // Indicates whether the device supports Apple Pay and whether the user has an active card in Wallet.
      // eslint-disable-next-line no-undef
      const promise = ApplePaySession.canMakePaymentsWithActiveCard(
        ApplePayMerchantId
      );
      promise.then(function (canMakePayments) {
        if (canMakePayments && ApplePayEnabled) {
          // Display Apple Pay Buttons here…
          const pelcroApplyPayButton = document.getElementById(
            "pelcro-apple-pay-button"
          );
          if (pelcroApplyPayButton) {
            pelcroApplyPayButton.style.display = "block";
          }
          console.log(
            "ApplePay canMakePayments function: ",
            canMakePayments
          );
        }
      });
    } else {
      console.error("ApplePay is not available on this browser");
    }
  }, []);

  useEffect(() => {
    function onApplePayButtonClicked() {
      // eslint-disable-next-line no-undef
      if (!ApplePaySession) {
        return;
      }

      const updatedPrice =
        state.updatedPrice ??
        props?.plan?.amount ??
        plan?.amount ??
        orderPrice ??
        invoice?.amount_remaining ??
        null;

      const getCurrencyCode = () => {
        if (plan) {
          return plan?.currency.toUpperCase();
        } else if (order) {
          return orderCurrency.toUpperCase();
        } else if (invoice) {
          return invoice?.currency.toUpperCase();
        }
      };

      dispatch({ type: DISABLE_SUBMIT, payload: true });

      // Define ApplePayPaymentRequest
      // @see https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/creating_an_apple_pay_session
      const ApplePayPaymentRequest = {
        countryCode:
          window?.Pelcro?.user?.location?.countryCode || "US",
        currencyCode: getCurrencyCode(),
        merchantCapabilities: ["supports3DS"],
        supportedNetworks: ["visa", "masterCard", "amex", "discover"],
        total: {
          label:
            plan?.nickname || orderLabel || `invoice #${invoice?.id}`,
          type: "final",
          amount: updatedPrice / 100
        }
      };

      // Create ApplePaySession
      // @todo - Clarify supported version parameter
      // @odo - Apple Pay demo uses version 6 (https://applepaydemo.apple.com/)
      const session = new ApplePaySession(3, ApplePayPaymentRequest); // eslint-disable-line no-undef

      // @todo - Detect whether web browser supports a particular Apple Pay version.
      // @see https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession/1778014-supportsversion

      session.onvalidatemerchant = async (event) => {
        const { validationURL } = event;
        // Call your own server to request a new merchant session.
        window.Pelcro.payment.startSession(
          {
            auth_token: window.Pelcro.user.read().auth_token,
            site_id: window.Pelcro.siteid,
            validation_url: validationURL
          },
          (err, res) => {
            if (err) {
              // Handle any errors during merchant validation
              session.abort();
              return dispatch({
                type: SHOW_ALERT,
                payload: {
                  type: "error",
                  content: getErrorMessages(err)
                }
              });
            }
            // Complete merchant validation with the merchant session object
            const merchantSession = res;
            session.completeMerchantValidation(merchantSession);
          }
        );
      };

      session.onpaymentmethodselected = (event) => {
        // Define ApplePayPaymentMethodUpdate based on the selected payment method.
        // No updates or errors are needed, pass an empty object.
        const newTotal = {
          label:
            plan?.nickname || orderLabel || `invoice #${invoice?.id}`,
          type: "final",
          amount: updatedPrice / 100
        };

        const newLineItems = [
          {
            label:
              plan?.nickname ||
              orderLabel ||
              `invoice #${invoice?.id}`,
            type: "final",
            amount: updatedPrice / 100
          }
        ];

        session.completePaymentMethodSelection(
          newTotal,
          newLineItems
        );
      };

      // TODO: Check if onshippingmethodselected it should be implemented
      // session.onshippingmethodselected = (event) => {
      //   // Define ApplePayShippingMethodUpdate based on the selected shipping method.
      //   // No updates or errors are needed, pass an empty object.
      //   const newTotal = {
      //     label: plan?.nickname || orderLabel || `invoice #${invoice?.id}`,
      //     type: "final",
      //     amount: updatedPrice / 100
      //   };

      //   const newLineItems = [
      //     {
      //       label: plan?.nickname || orderLabel || `invoice #${invoice?.id}`,
      //       type: "final",
      //       amount: updatedPrice / 100
      //     }
      //   ];

      //   session.completeShippingMethodSelection(newTotal, newLineItems);
      // };

      // TODO: Check if onshippingcontactselected it should be implemented
      // session.onshippingcontactselected = (event) => {
      //   // Define ApplePayShippingContactUpdate based on the selected shipping contact.
      //   const update = {};
      //   session.completeShippingContactSelection(update);
      // };

      session.onpaymentauthorized = (event) => {
        // Define ApplePayPaymentAuthorizationResult
        const result = {
          status: ApplePaySession.STATUS_SUCCESS // eslint-disable-line no-undef
        };
        const { paymentData } = event.payment.token;
        const { data, signature, version } = paymentData;
        const { ephemeralPublicKey, publicKeyHash, transactionId } =
          paymentData.header;
        const applePayToken = {
          data: data,
          signature: signature,
          version: version,
          header: {
            ephemeralPublicKey: ephemeralPublicKey,
            publicKeyHash: publicKeyHash,
            transactionId: transactionId
          }
        };

        const orderId = `pelcro-${new Date().getTime()}`;

        const eProtectRequestPreLiveURL =
          "https://request.eprotect.vantivprelive.com";
        const eProtectRequestProductionURL =
          "https://request.eprotect.vantivcnp.com";
        const eProtectRequestUrlToUse =
          window.Pelcro.site.read().vantiv_gateway_settings
            .environment === "production"
            ? eProtectRequestProductionURL
            : eProtectRequestPreLiveURL;

        const eProtectRequest = {
          paypageId: payPageId,
          reportGroup: reportGroup,
          orderId: orderId,
          id: orderId,
          applepay: applePayToken,
          url: eProtectRequestUrlToUse
        };

        // successCallback function to handle the response from WorldPay.
        function successCallback(vantivResponse) {
          const { expDate } = vantivResponse;

          const expMonth = expDate.substring(0, 2);
          const expYear = expDate.substring(2);

          const vantivPaymentRequest = {
            ...vantivResponse,
            expMonth: expMonth,
            expYear: expYear,
            applePay: true
          };

          // Process the registrationId or continue with further payment processing.
          dispatch({
            type: HANDLE_APPLEPAY_SUBSCRIPTION,
            payload: vantivPaymentRequest
          });
          dispatch({ type: LOADING, payload: true });

          session.completePayment(result);
        }

        // errorCallback function to handle any errors that may occur during the tokenization process.
        function errorCallback(error) {
          console.error("Error retrieving Registration ID:", error);
          // Handle error appropriately.
        }
        // errorCallback function to handle any errors that may occur during the tokenization process.
        function timeoutCallback() {
          console.error("eProtect Timeout");
          // Handle error appropriately.
        }

        // eslint-disable-next-line no-undef
        new eProtect().sendToEprotect(
          eProtectRequest,
          {},
          successCallback,
          errorCallback,
          timeoutCallback,
          15000
        );
      };

      // TODO: Check if oncouponcodechanged it should be implemented
      // session.oncouponcodechanged = (event) => {
      //   // Define ApplePayCouponCodeUpdate
      //   const newTotal = calculateNewTotal(event.couponCode);
      //   const newLineItems = calculateNewLineItems(event.couponCode);
      //   const newShippingMethods = calculateNewShippingMethods(
      //     event.couponCode
      //   );
      //   const errors = calculateErrors(event.couponCode);

      //   session.completeCouponCodeChange({
      //     newTotal: newTotal,
      //     newLineItems: newLineItems,
      //     newShippingMethods: newShippingMethods,
      //     errors: errors
      //   });
      // };

      session.oncancel = (event) => {
        // Payment cancelled by WebKit
        dispatch({ type: LOADING, payload: false });
        dispatch({ type: DISABLE_SUBMIT, payload: false });
      };

      session.begin();
    }

    const pelcroApplyPayButton = document.getElementById(
      "pelcro-apple-pay-button"
    );
    if (pelcroApplyPayButton) {
      pelcroApplyPayButton.addEventListener(
        "click",
        onApplePayButtonClicked
      );
    }

    return () => {
      if (pelcroApplyPayButton) {
        pelcroApplyPayButton.removeEventListener(
          "click",
          onApplePayButtonClicked
        );
      }
    };
  }, [state.updatedPrice]);

  return (
    <apple-pay-button
      id="pelcro-apple-pay-button"
      style={{ display: "none" }}
      buttonstyle="black"
      type="plain"
      locale="en-US"
    ></apple-pay-button>
  );
};
