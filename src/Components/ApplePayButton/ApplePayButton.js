import React, { useEffect, useContext, useCallback } from "react";
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
    apple_pay_enabled: ApplePayEnabled,
    environment
  } = window.Pelcro.site.read()?.vantiv_gateway_settings || {};

  const getOrderInfo = useCallback(() => {
    if (!order) {
      return { price: null, currency: null, label: null };
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
      return { price: null, currency: null, label: null };
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
  }, [order]);

  const { price: orderPrice, currency: orderCurrency, label: orderLabel } = getOrderInfo();

  const getCurrencyCode = useCallback(() => {
    if (plan) return plan.currency.toUpperCase();
    if (order) return orderCurrency.toUpperCase();
    if (invoice) return invoice.currency.toUpperCase();
    return "USD";
  }, [plan, order, invoice, orderCurrency]);

  const getUpdatedPrice = useCallback(() => {
    return state.updatedPrice ??
      props?.plan?.amount ??
      plan?.amount ??
      orderPrice ??
      invoice?.amount_remaining ??
      0;
  }, [state.updatedPrice, props?.plan?.amount, plan?.amount, orderPrice, invoice?.amount_remaining]);

  const getPaymentRequest = useCallback(() => {
    const updatedPrice = getUpdatedPrice();
    return {
      countryCode: window?.Pelcro?.user?.location?.countryCode || "US",
      currencyCode: getCurrencyCode(),
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      total: {
        label: plan?.nickname || orderLabel || (invoice ? `invoice #${invoice.id}` : "Payment"),
        type: "final",
        amount: (updatedPrice / 100).toFixed(2)
      }
    };
  }, [getCurrencyCode, getUpdatedPrice, plan, orderLabel, invoice]);

  const handlePaymentAuthorization = useCallback(async (session, payment) => {
    try {
      const { paymentData } = payment.payment.token;
      const { data, signature, version } = paymentData;
      const { ephemeralPublicKey, publicKeyHash, transactionId } = paymentData.header;

      const applePayToken = {
        data,
        signature,
        version,
        header: { ephemeralPublicKey, publicKeyHash, transactionId }
      };

      const orderId = `pelcro-${Date.now()}`;
      const eProtectRequestUrl = environment === "production"
        ? "https://request.eprotect.vantivcnp.com"
        : "https://request.eprotect.vantivprelive.com";

      const eProtectRequest = {
        paypageId: payPageId,
        reportGroup: reportGroup,
        orderId,
        id: orderId,
        applepay: applePayToken,
        url: eProtectRequestUrl
      };

      // Create a promise-based wrapper for eProtect
      const processEprotect = () => {
        return new Promise((resolve, reject) => {
          new eProtect().sendToEprotect(
            eProtectRequest,
            {},
            (response) => {
              const { expDate } = response;
              const expMonth = expDate.substring(0, 2);
              const expYear = expDate.substring(2);
              resolve({ ...response, expMonth, expYear, applePay: true });
            },
            reject,
            () => reject(new Error("eProtect Timeout")),
            15
          );
        });
      };

      const vantivPaymentRequest = await processEprotect();

      // Process the registrationId or continue with further payment processing.
      dispatch({
        type: HANDLE_APPLEPAY_SUBSCRIPTION,
        payload: vantivPaymentRequest
      });
      dispatch({ type: LOADING, payload: true });

      session.completePayment(ApplePaySession.STATUS_SUCCESS);
    } catch (error) {
      console.error("Error retrieving Registration ID:", error);
      // Handle error appropriately.
      session.completePayment(ApplePaySession.STATUS_FAILURE);
    }
  }, [dispatch, payPageId, reportGroup, environment]);

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

      const session = new ApplePaySession(3, getPaymentRequest());

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
          amount: (getUpdatedPrice() / 100).toFixed(2)
        };

        const newLineItems = [
          {
            label:
              plan?.nickname ||
              orderLabel ||
              `invoice #${invoice?.id}`,
            type: "final",
            amount: (getUpdatedPrice() / 100).toFixed(2)
          }
        ];

        session.completePaymentMethodSelection(
          newTotal,
          newLineItems
        );
      };

      session.onpaymentauthorized = async (event) => {
        await handlePaymentAuthorization(session, event.payment);
      };

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
  }, [getPaymentRequest, handlePaymentAuthorization, dispatch, plan, orderLabel, invoice]);

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
