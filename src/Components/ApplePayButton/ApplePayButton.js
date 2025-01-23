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

  // Check if Apple Pay is available
  useEffect(() => {
    if (window.ApplePaySession && ApplePayEnabled) {
      ApplePaySession.canMakePaymentsWithActiveCard(
        ApplePayMerchantId
      )
        .then(function (canMakePayments) {
          const pelcroApplyPayButton = document.getElementById(
            "pelcro-apple-pay-button"
          );
          if (canMakePayments && pelcroApplyPayButton) {
            pelcroApplyPayButton.style.display = "block";
          }
        })
        .catch((error) => {
          console.error("Apple Pay check failed:", error);
        });
    }
  }, [ApplePayMerchantId, ApplePayEnabled]);

  useEffect(() => {
    function onApplePayButtonClicked(event) {
      // Immediate check for Apple Pay support
      if (!window.ApplePaySession) {
        console.error("Apple Pay is not available");
        return;
      }

      // Prepare payment request immediately
      const updatedPrice =
        state.updatedPrice ??
        props?.plan?.amount ??
        plan?.amount ??
        orderPrice ??
        invoice?.amount_remaining ??
        0;

      const getCurrencyCode = () => {
        if (plan) {
          return plan?.currency.toUpperCase();
        } else if (order) {
          return orderCurrency.toUpperCase();
        } else if (invoice) {
          return invoice?.currency.toUpperCase();
        }
        return "USD"; // Default fallback
      };

      // Create payment request immediately
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
          amount: (updatedPrice / 100).toFixed(2)
        }
      };

      // Create session immediately
      const session = new ApplePaySession(3, ApplePayPaymentRequest);

      // Set up handlers
      session.onvalidatemerchant = async (event) => {
        const { validationURL } = event;
        window.Pelcro.payment.startSession(
          {
            auth_token: window.Pelcro.user.read().auth_token,
            site_id: window.Pelcro.siteid,
            validation_url: validationURL
          },
          (err, res) => {
            if (err) {
              session.abort();
              dispatch({
                type: SHOW_ALERT,
                payload: {
                  type: "error",
                  content: getErrorMessages(err)
                }
              });
              return;
            }
            session.completeMerchantValidation(res);
          }
        );
      };

      session.onpaymentmethodselected = (event) => {
        const newTotal = {
          label:
            plan?.nickname || orderLabel || `invoice #${invoice?.id}`,
          type: "final",
          amount: (updatedPrice / 100).toFixed(2)
        };

        const newLineItems = [
          {
            label:
              plan?.nickname ||
              orderLabel ||
              `invoice #${invoice?.id}`,
            type: "final",
            amount: (updatedPrice / 100).toFixed(2)
          }
        ];

        session.completePaymentMethodSelection(
          newTotal,
          newLineItems
        );
      };

      session.onpaymentauthorized = (event) => {
        const result = {
          status: ApplePaySession.STATUS_SUCCESS
        };

        const { paymentData } = event.payment.token;
        const { data, signature, version } = paymentData;
        const { ephemeralPublicKey, publicKeyHash, transactionId } =
          paymentData.header;

        const applePayToken = {
          data,
          signature,
          version,
          header: {
            ephemeralPublicKey,
            publicKeyHash,
            transactionId
          }
        };

        const orderId = `pelcro-${new Date().getTime()}`;
        const eProtectRequestUrl =
          window.Pelcro.site.read().vantiv_gateway_settings
            .environment === "production"
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

        function successCallback(vantivResponse) {
          const { expDate } = vantivResponse;
          const expMonth = expDate.substring(0, 2);
          const expYear = expDate.substring(2);

          const vantivPaymentRequest = {
            ...vantivResponse,
            expMonth,
            expYear,
            applePay: true
          };

          dispatch({
            type: HANDLE_APPLEPAY_SUBSCRIPTION,
            payload: vantivPaymentRequest
          });

          session.completePayment(result);
          dispatch({ type: LOADING, payload: true });
        }

        function errorCallback(error) {
          console.error("eProtect error:", error);
          session.completePayment({
            status: ApplePaySession.STATUS_FAILURE
          });
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: "Payment processing failed"
            }
          });
        }

        function timeoutCallback() {
          console.error("eProtect timeout");
          session.completePayment({
            status: ApplePaySession.STATUS_FAILURE
          });
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: "Payment request timed out"
            }
          });
        }

        // Process payment
        new eProtect().sendToEprotect(
          eProtectRequest,
          {},
          successCallback,
          errorCallback,
          timeoutCallback,
          15000
        );
      };

      session.oncancel = (event) => {
        dispatch({ type: LOADING, payload: false });
        dispatch({ type: DISABLE_SUBMIT, payload: false });
      };

      // Begin session immediately after setup
      try {
        session.begin();
      } catch (error) {
        console.error("Failed to begin Apple Pay session:", error);
        dispatch({
          type: SHOW_ALERT,
          payload: {
            type: "error",
            content: "Failed to initialize Apple Pay"
          }
        });
      }
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
      const button = document.getElementById(
        "pelcro-apple-pay-button"
      );
      if (button) {
        button.removeEventListener("click", onApplePayButtonClicked);
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
