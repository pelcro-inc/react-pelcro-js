import React, {
  createContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import {
  injectStripe,
  Elements,
  StripeProvider
} from "react-stripe-elements";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update,
  SideEffect
} from "use-reducer-with-side-effects";

import {
  DISABLE_SUBMIT,
  LOADING,
  SET_UPDATED_PRICE,
  SET_TAX_AMOUNT,
  SUBMIT_PAYMENT,
  HANDLE_PAYPAL_SUBSCRIPTION,
  DISABLE_COUPON_BUTTON,
  APPLY_COUPON_CODE,
  SET_PERCENT_OFF,
  SET_COUPON,
  SET_COUPON_ERROR,
  UPDATE_COUPON_CODE,
  SHOW_COUPON_FIELD,
  SET_CAN_MAKE_PAYMENT,
  SET_PAYMENT_REQUEST,
  INIT_CONTAINER,
  UPDATE_PAYMENT_REQUEST,
  SHOW_ALERT,
  SUBSCRIBE,
  REMOVE_APPLIED_COUPON,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_PHONE,
  SET_FIRST_NAME_ERROR,
  SET_LAST_NAME_ERROR,
  SET_PHONE_ERROR
} from "../../utils/action-types";
import {
  getErrorMessages,
  debounce,
  getSiteCardProcessor
} from "../common/Helpers";
import {
  Payment,
  StripeGateway,
  PaypalGateway,
  VantivGateway,
  TapGateway,
  PAYMENT_TYPES
} from "../../services/Subscription/Payment.service";
import { getPageOrDefaultLanguage } from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";

/**
 * @typedef {Object} PaymentStateType
 * @property {boolean} disableSubmit
 * @property {boolean} isLoading
 * @property {boolean} disableCouponButton
 * @property {object} couponObject
 * @property {string} couponCode
 * @property {string} couponError
 * @property {boolean} enableCouponField
 * @property {string} percentOff
 * @property {unknown} canMakePayment
 * @property {unknown} paymentRequest
 * @property {number} updatedPrice
 * @property {number} taxAmount
 * @property {object} currentPlan
 * @property {object} alert
 */

/** @type {PaymentStateType} */
const initialState = {
  disableSubmit: false,
  isLoading: false,
  disableCouponButton: false,
  couponObject: null,
  couponCode: "",
  couponError: "",
  enableCouponField: false,
  percentOff: "",
  canMakePayment: false,
  paymentRequest: null,
  updatedPrice: null,
  taxAmount: null,
  currentPlan: null,
  firstName: "",
  lastName: "",
  phone: "",
  firstNameError: null,
  lastNameError: null,
  phoneError: null,
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const PaymentMethodContainerWithoutStripe = ({
  style,
  className = "",
  children,
  stripe,
  type,
  onSuccess = () => {},
  onGiftRenewalSuccess = () => {},
  onFailure = () => {},
  ...props
}) => {
  const { t } = useTranslation("payment");
  const pelcroStore = usePelcro();
  const { set, order, selectedPaymentMethodId, couponCode } =
    usePelcro();

  const product = props.product ?? pelcroStore.product;
  const plan = props.plan ?? pelcroStore.plan;
  const subscriptionIdToRenew =
    props.subscriptionIdToRenew ?? pelcroStore.subscriptionIdToRenew;
  const selectedAddressId =
    props.selectedAddressId ?? pelcroStore.selectedAddressId;
  const giftRecipient =
    props.giftRecipient ?? pelcroStore.giftRecipient;
  const isGift = props.isGift ?? pelcroStore.isGift;
  const isRenewingGift =
    props.isRenewingGift ?? pelcroStore.isRenewingGift;
  const invoice = props.invoice ?? pelcroStore.invoice;

  useEffect(() => {
    if (window.Pelcro.coupon.getFromUrl()) {
      dispatch({
        type: UPDATE_COUPON_CODE,
        payload: window.Pelcro.coupon.getFromUrl()
      });
    } else if (couponCode) {
      dispatch({
        type: UPDATE_COUPON_CODE,
        payload: couponCode
      });
    }
    dispatch({ type: INIT_CONTAINER });
    updateTotalAmountWithTax();
  }, []);

  /*====== Start Tap integration ========*/
  const submitUsingTap = () => {
    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );
    if (isUsingExistingPaymentMethod) {
      // no need to create a new source using tap
      return handleTapPayment(null);
    }

    if (!tapInstanceRef.current) {
      return console.error(
        "Tap sdk script wasn't loaded, you need to load tap sdk before rendering the tap payment flow"
      );
    }

    const getOrderItemsTotal = () => {
      if (!order) {
        return null;
      }

      const isQuickPurchase = !Array.isArray(order);

      if (isQuickPurchase) {
        return order.price * order.quantity;
      }

      if (order.length === 0) {
        return null;
      }

      return order.reduce((total, item) => {
        return total + item.price * item.quantity;
      }, 0);
    };

    const totalAmount =
      state?.updatedPrice ??
      plan?.amount ??
      invoice?.amount_remaining ??
      getOrderItemsTotal();

    tapInstanceRef.current
      .createToken(tapInstanceCard.current)
      .then(function (result) {
        if (result.error) {
          // Inform the user if there was an error
          onFailure(result.error);
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
          return dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(result.error)
            }
          });
        } else {
          window.Pelcro.payment.authorize(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              first_name:
                window.Pelcro.user.read().first_name ||
                state.firstName,
              last_name:
                window.Pelcro.user.read().last_name || state.lastName,
              phone: window.Pelcro.user.read().phone || state.phone,
              site_id: window.Pelcro.siteid,
              amount: totalAmount,
              currency:
                plan?.currency ||
                invoice?.currency ||
                window.Pelcro.site.read().default_currency,
              tap_token: result.id,
              redirect_url: `${
                window.Pelcro.environment.domain
              }/webhook/tap/callback/3dsecure?auth_token=${
                window.Pelcro.user.read().auth_token
              }`
            },
            (err, res) => {
              if (err) {
                // Inform the user if there was an error
                onFailure(err);
                dispatch({ type: DISABLE_SUBMIT, payload: false });
                dispatch({ type: LOADING, payload: false });
                return dispatch({
                  type: SHOW_ALERT,
                  payload: {
                    type: "error",
                    content: getErrorMessages(err)
                  }
                });
              } else {
                toggleAuthenticationPendingView(true, res);

                const listenFor3DSecureCompletionMessage = () => {
                  const retrieveSourceInfoFromIframe = (event) => {
                    const { data } = event;
                    if (
                      data.message === "3DS-authentication-complete"
                    ) {
                      const tapID = data.tapID;
                      toggleAuthenticationPendingView(false);
                      window.removeEventListener(
                        "message",
                        retrieveSourceInfoFromIframe
                      );

                      dispatch({
                        type: SHOW_ALERT,
                        payload: {
                          type: "error",
                          content: null
                        }
                      });

                      handleTapPayment(tapID);
                    }
                  };

                  // listen to injected iframe for authentication complete message
                  window.addEventListener(
                    "message",
                    retrieveSourceInfoFromIframe
                  );
                };

                listenFor3DSecureCompletionMessage();
              }
            }
          );
        }
      });
  };

  function handleTapPayment(paymentRequest) {
    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );

    if (type === "createPayment") {
      handleTapSubscription();
    } else if (type === "orderCreate") {
      purchase(
        new TapGateway(),
        isUsingExistingPaymentMethod
          ? selectedPaymentMethodId
          : paymentRequest,
        state,
        dispatch
      );
    } else if (type === "invoicePayment") {
      payInvoice(
        new TapGateway(),
        isUsingExistingPaymentMethod
          ? selectedPaymentMethodId
          : paymentRequest,
        dispatch
      );
    } else if (type === "updatePaymentSource") {
      createNewTapCard();
    }

    function createNewTapCard() {
      window.Pelcro.source.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          token: paymentRequest,
          gateway: "tap"
        },
        (err, res) => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
          if (err) {
            onFailure(err);
            return dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
          }

          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "success",
              content: t("messages.sourceUpdated")
            }
          });
          onSuccess(res);
        }
      );
    }

    function handleTapSubscription() {
      const payment = new Payment(new TapGateway());

      const createSubscription = !isGift && !subscriptionIdToRenew;
      const renewSubscription = !isGift && subscriptionIdToRenew;
      const giftSubscriprition = isGift && !subscriptionIdToRenew;
      const renewGift = isRenewingGift;

      const { couponCode } = state;

      if (renewGift) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.RENEW_GIFTED_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            subscriptionIdToRenew,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      } else if (giftSubscriprition) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.CREATE_GIFTED_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            quantity: plan.quantity,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            giftRecipient,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      } else if (renewSubscription) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.RENEW_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            quantity: plan.quantity,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            subscriptionIdToRenew,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      } else if (createSubscription) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            quantity: plan.quantity,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      }
    }
  }
  /*====== End Tap integration ========*/

  const submitUsingVantiv = () => {
    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );
    if (isUsingExistingPaymentMethod) {
      // no need to create a new source using vantiv
      return handleVantivPayment(null);
    }

    if (!vantivInstanceRef.current) {
      return console.error(
        "Vantiv sdk script wasn't loaded, you need to load vantiv sdk before rendering the vantiv payment flow"
      );
    }

    const orderId = `pelcro-${new Date().getTime()}`;
    /*     
    calls handleVantivPayment to either handle a payment or update a source by simply creating a new source 
    */
    vantivInstanceRef.current.getPaypageRegistrationId({
      id: orderId,
      orderId: orderId
    });
  };

  function handleVantivPayment(paymentRequest) {
    if (paymentRequest) {
      const SUCCESS_STATUS = "870";
      if (paymentRequest.response !== SUCCESS_STATUS) {
        switch (paymentRequest.response) {
          case "871":
            return handlePaymentError({
              error: new Error("Invalid account number")
            });
          default:
            return handlePaymentError({
              error: new Error(paymentRequest.message)
            });
        }
      }
    }

    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );

    if (type === "createPayment") {
      handleVantivSubscription();
    } else if (type === "orderCreate") {
      purchase(
        new VantivGateway(),
        isUsingExistingPaymentMethod
          ? selectedPaymentMethodId
          : paymentRequest,
        state,
        dispatch
      );
    } else if (type === "invoicePayment") {
      payInvoice(
        new VantivGateway(),
        isUsingExistingPaymentMethod
          ? selectedPaymentMethodId
          : paymentRequest,
        dispatch
      );
    } else if (type === "updatePaymentSource") {
      createNewVantivCard();
    }

    function createNewVantivCard() {
      window.Pelcro.source.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          token: paymentRequest,
          gateway: "vantiv"
        },
        (err, res) => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
          if (err) {
            onFailure(err);
            return dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
          }

          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "success",
              content: t("messages.sourceUpdated")
            }
          });
          onSuccess(res);
        }
      );
    }

    function handleVantivSubscription() {
      const payment = new Payment(new VantivGateway());

      const createSubscription = !isGift && !subscriptionIdToRenew;
      const renewSubscription = !isGift && subscriptionIdToRenew;
      const giftSubscriprition = isGift && !subscriptionIdToRenew;
      const renewGift = isRenewingGift;

      const { couponCode } = state;

      if (renewGift) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.RENEW_GIFTED_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            subscriptionIdToRenew,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      } else if (giftSubscriprition) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.CREATE_GIFTED_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            quantity: plan.quantity,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            giftRecipient,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      } else if (renewSubscription) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.RENEW_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            quantity: plan.quantity,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            subscriptionIdToRenew,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      } else if (createSubscription) {
        return payment.execute(
          {
            type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
            token: isUsingExistingPaymentMethod
              ? selectedPaymentMethodId
              : paymentRequest,
            quantity: plan.quantity,
            plan,
            couponCode,
            product,
            isExistingSource: isUsingExistingPaymentMethod,
            addressId: selectedAddressId
          },
          (err, res) => {
            if (err) {
              return handlePaymentError(err);
            }
            onSuccess(res);
          }
        );
      }
    }
  }

  const vantivInstanceRef = React.useRef(null);
  const tapInstanceRef = React.useRef(null);
  const tapInstanceCard = React.useRef(null);

  useEffect(() => {
    const cardProcessor = getSiteCardProcessor();

    if (cardProcessor === "vantiv" && !selectedPaymentMethodId) {
      const payPageId =
        window.Pelcro.site.read()?.vantiv_gateway_settings
          .pay_page_id;
      const reportGroup =
        window.Pelcro.site.read()?.vantiv_gateway_settings
          .report_group;

      vantivInstanceRef.current = new window.EprotectIframeClient({
        paypageId: payPageId,
        reportGroup: reportGroup,
        style: "enhancedStyle3",
        height: "245",
        timeout: 50000,
        div: "eProtectiframe",
        callback: handleVantivPayment,
        showCvv: true,
        numYears: 8,
        placeholderText: {
          cvv: "CVV",
          accountNumber: "1234 1234 1234 1234"
        },
        enhancedUxFeatures: {
          inlineFieldValidations: true,
          expDateValidation: true,
          numericInputsOnly: true
        }
      });
    }

    if (cardProcessor === "tap" && !selectedPaymentMethodId) {
      const tapKey = Tapjsli(
        window.Pelcro.site.read()?.tap_gateway_settings
          .publishable_key
      );

      let elements = tapKey.elements({});

      let style = {
        base: {
          color: "#535353",
          lineHeight: "18px",
          fontFamily: "sans-serif",
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "rgba(0, 0, 0, 0.26)",
            fontSize: "15px"
          }
        },
        invalid: {
          color: "red"
        }
      };

      // input labels/placeholders
      let labels = {
        cardNumber: "Card Number",
        expirationDate: "MM/YY",
        cvv: "CVV",
        cardHolder: "Card Holder Name"
      };

      //payment options
      let paymentOptions = {
        labels: labels,
        TextDirection: "ltr"
      };

      //create element, pass style and payment options
      let card = elements.create(
        "card",
        { style: style },
        paymentOptions
      );

      //mount element
      card.mount("#tapPaymentIframe");

      //card change event listener
      card.addEventListener("change", function (event) {
        // if (event.error_interactive) {
        //   onFailure(event.error_interactive);
        //   return dispatch({
        //     type: SHOW_ALERT,
        //     payload: {
        //       type: "error",
        //       content: getErrorMessages(event.error_interactive)
        //     }
        //   });
        // } else {
        //   dispatch({
        //     type: SHOW_ALERT,
        //     payload: { type: "error", content: "" }
        //   });
        // }
        // let displayError = document.getElementById("error-handler");
        // if (event.error) {
        //   displayError.textContent = event.error.message;
        // } else {
        //   displayError.textContent = "";
        // }
      });

      tapInstanceRef.current = tapKey;
      tapInstanceCard.current = card;
    }
  }, [selectedPaymentMethodId]);

  const initPaymentRequest = (state, dispatch) => {
    try {
      const paymentRequest = stripe.paymentRequest({
        country: window.Pelcro.user.location.countryCode || "US",
        currency: plan.currency,
        total: {
          label: plan.nickname || plan.description,
          amount: state.updatedPrice || plan.amount
        }
      });

      // When Google pay / Apple pay source created
      paymentRequest.on("source", ({ complete, source, ...data }) => {
        dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        dispatch({ type: LOADING, payload: true });
        complete("success");

        if (source?.card?.three_d_secure === "required") {
          return generate3DSecureSource(source).then(
            ({ source, error }) => {
              if (error) {
                return handlePaymentError(error);
              }

              toggleAuthenticationPendingView(true, source);
            }
          );
        }

        dispatch({
          type: SUBSCRIBE,
          payload: source
        });
      });

      paymentRequest.canMakePayment().then((result) => {
        dispatch({ type: SET_CAN_MAKE_PAYMENT, payload: !!result });
      });

      dispatch({
        type: SET_PAYMENT_REQUEST,
        payload: paymentRequest
      });
    } catch {
      console.log(
        "Google Pay/Apple pay isn't available/supported in this country"
      );
    }
  };

  /**
   * Updates the total amount after adding taxes only if site taxes are enabled
   */
  const updateTotalAmountWithTax = () => {
    const taxesEnabled = window.Pelcro.site.read()?.taxes_enabled;

    if (taxesEnabled && type === "createPayment") {
      dispatch({ type: DISABLE_SUBMIT, payload: true });

      resolveTaxCalculation()
        .then((res) => {
          if (res) {
            dispatch({
              type: SET_TAX_AMOUNT,
              payload: res.taxAmount
            });

            dispatch({
              type: SET_UPDATED_PRICE,
              payload: res.totalAmountWithTax
            });

            dispatch({ type: UPDATE_PAYMENT_REQUEST });
          }
        })
        .catch((error) => {
          handlePaymentError(error);
        })
        .finally(() => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
        });
    }
  };

  const onApplyCouponCode = (state, dispatch) => {
    const { couponCode } = state;

    const handleCouponResponse = (err, res) => {
      dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });

      if (err) {
        onFailure(err);

        dispatch({
          type: SET_COUPON_ERROR,
          payload: getErrorMessages(err)
        });

        // remove current coupon
        dispatch({
          type: SET_COUPON,
          payload: null
        });

        dispatch({
          type: SET_PERCENT_OFF,
          payload: ""
        });

        dispatch({
          type: SET_UPDATED_PRICE,
          payload: null
        });

        dispatch({
          type: SET_TAX_AMOUNT,
          payload: null
        });

        const { currentPlan } = state;

        if (currentPlan) {
          const quantity = currentPlan.quantity ?? 1;
          const price = currentPlan.amount;

          dispatch({
            type: SET_UPDATED_PRICE,
            // set original plan price
            payload: price * quantity
          });
          dispatch({ type: UPDATE_PAYMENT_REQUEST });

          // update the new amount with taxes if site has taxes enabled
          updateTotalAmountWithTax();
        }

        return;
      }

      dispatch({ type: SET_COUPON_ERROR, payload: "" });
      dispatch({
        type: SHOW_ALERT,
        payload: { type: "error", content: "" }
      });

      dispatch({
        type: SET_COUPON,
        payload: res.data.coupon
      });

      dispatch({
        type: SET_PERCENT_OFF,
        payload: `${res.data.coupon?.percent_off}%`
      });

      dispatch({
        type: SET_TAX_AMOUNT,
        payload: res.data.taxes
      });

      dispatch({
        type: SET_UPDATED_PRICE,
        payload: res.data.total
      });

      dispatch({ type: UPDATE_PAYMENT_REQUEST });
    };

    if (couponCode?.trim() === "") {
      dispatch({
        type: SET_COUPON,
        payload: null
      });

      dispatch({
        type: SET_PERCENT_OFF,
        payload: ""
      });

      dispatch({
        type: SET_UPDATED_PRICE,
        payload: null
      });

      dispatch({
        type: SET_TAX_AMOUNT,
        payload: null
      });

      dispatch({ type: UPDATE_PAYMENT_REQUEST });
      updateTotalAmountWithTax();
    }

    if (couponCode?.trim()) {
      dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });

      if (type === "createPayment") {
        window.Pelcro.order.create(
          {
            auth_token: window.Pelcro.user.read().auth_token,
            plan_id: plan.id,
            campaign_key:
              window.Pelcro.helpers.getURLParameter("campaign_key"),
            coupon_code: couponCode,
            address_id: selectedAddressId
          },
          handleCouponResponse
        );
      } else if (type === "orderCreate") {
        const isQuickPurchase = !Array.isArray(order);
        const mappedOrderItems = isQuickPurchase
          ? [{ sku_id: order.id, quantity: order.quantity }]
          : order.map((item) => ({
              sku_id: item.id,
              quantity: item.quantity
            }));

        window.Pelcro.ecommerce.order.createSummary(
          {
            items: mappedOrderItems,
            coupon_code: couponCode
          },
          handleCouponResponse
        );
      }
    }
  };

  const debouncedApplyCouponCode = useRef(
    debounce(onApplyCouponCode, 1000)
  ).current;

  const removeAppliedCoupon = (state) => {
    state.couponCode = "";

    dispatch({ type: SET_COUPON_ERROR, payload: "" });

    dispatch({
      type: SHOW_COUPON_FIELD,
      payload: false
    });

    dispatch({
      type: SET_COUPON,
      payload: null
    });

    dispatch({
      type: SET_PERCENT_OFF,
      payload: ""
    });

    dispatch({
      type: SET_UPDATED_PRICE,
      payload: null
    });

    dispatch({
      type: SET_TAX_AMOUNT,
      payload: null
    });

    const { currentPlan } = state;

    if (currentPlan) {
      const quantity = currentPlan.quantity ?? 1;
      const price = currentPlan.amount;

      dispatch({
        type: SET_UPDATED_PRICE,
        // set original plan price
        payload: price * quantity
      });
      dispatch({ type: UPDATE_PAYMENT_REQUEST });

      // update the new amount with taxes if site has taxes enabled
      updateTotalAmountWithTax();
    }
  };

  /**
   * Attempt to confirm a Stripe card payment via it's PaymentIntent.
   * Only trigger method if PaymentIntent status is `requires_action`.
   *
   * @see https://stripe.com/docs/payments/intents#intent-statuses
   *
   * @param response
   * @param error
   * @returns {*}
   */
  const confirmStripeCardPayment = (
    response,
    error,
    isSubCreate = false
  ) => {
    if (response) {
      const paymentIntent = response.data?.payment_intent;
      if (
        paymentIntent?.status === "requires_action" &&
        paymentIntent?.client_secret
      ) {
        stripe
          .confirmCardPayment(paymentIntent.client_secret)
          .then((res) => {
            if (!isSubCreate) {
              dispatch({ type: DISABLE_SUBMIT, payload: false });
            }
            dispatch({ type: LOADING, payload: false });

            if (res.error) {
              onFailure(res.error);
              return dispatch({
                type: SHOW_ALERT,
                payload: {
                  type: "error",
                  content: isSubCreate
                    ? t("messages.tryAgainFromInvoice")
                    : getErrorMessages(res.error)
                }
              });
            }
            onSuccess(res);
          });
      } else if (
        paymentIntent?.status === "requires_payment_method" &&
        paymentIntent?.client_secret
      ) {
        if (!isSubCreate) {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
        }
        dispatch({ type: LOADING, payload: false });

        return dispatch({
          type: SHOW_ALERT,
          payload: {
            type: "error",
            content: isSubCreate
              ? t("messages.tryAgainFromInvoice")
              : t("messages.cardAuthFailed")
          }
        });
      } else {
        onSuccess(response);
      }
    } else {
      dispatch({ type: DISABLE_SUBMIT, payload: false });
      dispatch({ type: LOADING, payload: false });

      if (error) {
        onFailure(error);
        return dispatch({
          type: SHOW_ALERT,
          payload: {
            type: "error",
            content: getErrorMessages(error)
          }
        });
      }
      onSuccess(response);
    }
  };

  const subscribe = (stripeSource, state, dispatch) => {
    const { couponCode } = state;

    if (!subscriptionIdToRenew) {
      window.Pelcro.subscription.create(
        {
          source_id: stripeSource.isExistingSource
            ? stripeSource.id
            : undefined,
          stripe_token: !stripeSource.isExistingSource
            ? stripeSource.id
            : undefined,
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: plan.id,
          campaign_key:
            window.Pelcro.helpers.getURLParameter("campaign_key"),
          quantity: plan.quantity,
          coupon_code: couponCode,
          gift_recipient_email: giftRecipient
            ? giftRecipient.email
            : null,
          gift_recipient_first_name: giftRecipient?.firstName,
          gift_recipient_last_name: giftRecipient?.lastName,
          gift_start_date: giftRecipient?.startDate,
          gift_message: giftRecipient?.giftMessage,
          address_id: product.address_required
            ? selectedAddressId
            : null
        },
        (err, res) => {
          confirmStripeCardPayment(res, err, true);
        }
      );
    } else {
      if (isRenewingGift) {
        window.Pelcro.subscription.renewGift(
          {
            source_id: stripeSource.isExistingSource
              ? stripeSource.id
              : undefined,
            stripe_token: !stripeSource.isExistingSource
              ? stripeSource.id
              : undefined,
            auth_token: window.Pelcro.user.read().auth_token,
            plan_id: plan.id,
            quantity: plan.quantity,
            coupon_code: couponCode,
            subscription_id: subscriptionIdToRenew,
            address_id: product.address_required
              ? selectedAddressId
              : null
          },
          (err, res) => {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });

            if (err) {
              onFailure(err);
              return dispatch({
                type: SHOW_ALERT,
                payload: {
                  type: "error",
                  content: getErrorMessages(err)
                }
              });
            }

            onGiftRenewalSuccess(res);
          }
        );
      } else {
        window.Pelcro.subscription.renew(
          {
            source_id: stripeSource.isExistingSource
              ? stripeSource.id
              : undefined,
            stripe_token: !stripeSource.isExistingSource
              ? stripeSource.id
              : undefined,
            auth_token: window.Pelcro.user.read().auth_token,
            plan_id: plan.id,
            campaign_key:
              window.Pelcro.helpers.getURLParameter("campaign_key"),
            coupon_code: couponCode,
            subscription_id: subscriptionIdToRenew,
            address_id: product.address_required
              ? selectedAddressId
              : null
          },
          (err, res) => {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });

            if (err) {
              onFailure(err);
              return dispatch({
                type: SHOW_ALERT,
                payload: {
                  type: "error",
                  content: getErrorMessages(err)
                }
              });
            }
            onSuccess(res);
          }
        );
      }
    }

    // Prevent the form from being submitted:
    return false;
  };

  /**
   * Handles subscriptions from PayPal gateway
   * @param {PaymentStateType} state
   * @param {string} paypalNonce
   * @return {void}
   */
  const handlePaypalSubscription = (state, paypalNonce) => {
    const payment = new Payment(new PaypalGateway());
    const { couponCode } = state;

    /**
     * @TODO: Add flags for types instead of testing by properties
     */

    if (giftRecipient) {
      return payment.execute(
        {
          type: PAYMENT_TYPES.CREATE_GIFTED_SUBSCRIPTION,
          token: paypalNonce,
          quantity: plan.quantity,
          plan,
          couponCode,
          product,
          giftRecipient,
          addressId: selectedAddressId
        },

        (err, res) => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });

          if (err) {
            onFailure(err);
            return dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
          }
          onSuccess(res);
        }
      );
    }

    return payment.execute(
      {
        type: PAYMENT_TYPES.CREATE_SUBSCRIPTION,
        token: paypalNonce,
        quantity: plan.quantity,
        plan,
        couponCode,
        product,
        addressId: selectedAddressId
      },
      (err, res) => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });
        dispatch({ type: LOADING, payload: false });

        if (err) {
          onFailure(err);
          return dispatch({
            type: SHOW_ALERT,
            payload: { type: "error", content: getErrorMessages(err) }
          });
        }
        onSuccess(res);
      }
    );
  };

  const purchase = (
    gatewayService,
    gatewayToken,
    state,
    dispatch
  ) => {
    const isQuickPurchase = !Array.isArray(order);
    const mappedOrderItems = isQuickPurchase
      ? [{ sku_id: order.id, quantity: order.quantity }]
      : order.map((item) => ({
          sku_id: item.id,
          quantity: item.quantity
        }));

    const { couponCode } = state;

    const payment = new Payment(gatewayService);

    payment.execute(
      {
        type: PAYMENT_TYPES.PURCHASE_ECOMMERCE_ORDER,
        token: gatewayToken,
        isExistingSource: Boolean(selectedPaymentMethodId),
        items: mappedOrderItems,
        addressId: selectedAddressId,
        couponCode
      },
      (err, res) => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });
        dispatch({ type: LOADING, payload: false });

        if (err) {
          onFailure(err);
          return dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: getErrorMessages(err)
            }
          });
        }

        if (isQuickPurchase) {
          set({ order: null });
        } else {
          set({ order: null, cartItems: [] });
        }

        onSuccess(res);
      }
    );
  };

  const payInvoice = (gatewayService, gatewayToken, dispatch) => {
    const payment = new Payment(gatewayService);

    return payment.execute(
      {
        type: PAYMENT_TYPES.PAY_INVOICE,
        token: gatewayToken,
        isExistingSource: Boolean(selectedPaymentMethodId),
        invoiceId: invoice.id
      },
      (err, res) => {
        confirmStripeCardPayment(res, err);
      }
    );
  };

  const updatePaymentSource = (state, dispatch) => {
    return stripe
      .createSource({ type: "card" })
      .then(({ source, error }) => {
        if (error) {
          return handlePaymentError(error);
        }

        // We don't support source creation for 3D secure yet
        if (source?.card?.three_d_secure === "required") {
          return handlePaymentError({
            error: {
              message: t("messages.cardAuthNotSupported")
            }
          });
        }

        window.Pelcro.source.create(
          {
            auth_token: window.Pelcro.user.read().auth_token,
            token: source.id
          },
          (err, res) => {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
            if (err) {
              onFailure(err);
              return dispatch({
                type: SHOW_ALERT,
                payload: {
                  type: "error",
                  content: getErrorMessages(err)
                }
              });
            }

            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "success",
                content: t("messages.sourceUpdated")
              }
            });
            onSuccess(res);
          }
        );
      });
  };

  const updatePaymentRequest = (state) => {
    state?.paymentRequest?.update({
      total: {
        label: plan.nickname || plan.description,
        amount: state.updatedPrice
      }
    });
  };

  const submitPayment = (state, dispatch) => {
    stripe
      .createSource({ type: "card" })
      .then(({ source, error }) => {
        if (error) {
          return handlePaymentError(error);
        }

        const getOrderItemsTotal = () => {
          if (!order) {
            return null;
          }

          const isQuickPurchase = !Array.isArray(order);

          if (isQuickPurchase) {
            return order.price * order.quantity;
          }

          if (order.length === 0) {
            return null;
          }

          return order.reduce((total, item) => {
            return total + item.price * item.quantity;
          }, 0);
        };

        const totalAmount =
          state?.updatedPrice ??
          plan?.amount ??
          invoice?.amount_remaining ??
          getOrderItemsTotal();

        return handlePayment(source);
      })
      .catch((error) => {
        return handlePaymentError(error);
      });
  };

  /**
   * Resolves with the total & tax amount incase taxes enabled by site
   * @return {Promise}
   */
  const resolveTaxCalculation = () => {
    if (type === "invoicePayment") {
      return new Promise((resolve) => resolve());
    }

    const taxesEnabled = window.Pelcro.site.read()?.taxes_enabled;

    return new Promise((resolve, reject) => {
      // resolve early if taxes isn't enabled
      if (!taxesEnabled) {
        return resolve(null);
      }

      window.Pelcro.order.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: plan.id,
          campaign_key:
            window.Pelcro.helpers.getURLParameter("campaign_key"),
          coupon_code: state?.couponCode,
          address_id: selectedAddressId
        },
        (error, res) => {
          if (error) {
            return reject(error);
          }

          const taxAmount = res.data?.taxes;
          const totalAmountWithTax = res.data?.total;
          resolve({ totalAmountWithTax, taxAmount });
        }
      );
    });
  };

  /**
   * Resolves with a generated stripe 3DSecure source
   * @param {Object} source stripe's source object
   * @param {number | null} totalAmount total amount with taxes added incase taxes enabled
   * @return {Promise}
   */
  const generate3DSecureSource = (source, totalAmount) => {
    const listenFor3DSecureCompletionMessage = () => {
      const retrieveSourceInfoFromIframe = (event) => {
        const { data } = event;
        if (data.message === "3DS-authentication-complete") {
          toggleAuthenticationPendingView(false);
          retrieveSource(
            data.sourceId,
            data.clientSecret,
            handlePayment
          );
          window.removeEventListener(
            "message",
            retrieveSourceInfoFromIframe
          );
        }
      };

      // listen to injected iframe for authentication complete message
      window.addEventListener(
        "message",
        retrieveSourceInfoFromIframe
      );
    };

    listenFor3DSecureCompletionMessage();

    return stripe.createSource({
      type: "three_d_secure",
      amount: totalAmount,
      currency:
        plan?.currency ||
        invoice?.currency ||
        window.Pelcro.site.read().default_currency,
      three_d_secure: {
        card: source?.id
      },
      redirect: {
        return_url: `${
          window.Pelcro.environment.domain
        }/webhook/stripe/callback/3dsecure?auth_token=${
          window.Pelcro.user.read().auth_token
        }`
      }
    });
  };

  const handlePayment = (stripeSource) => {
    if (stripeSource && type === "createPayment") {
      subscribe(stripeSource, state, dispatch);
    } else if (stripeSource && type === "orderCreate") {
      purchase(new StripeGateway(), stripeSource.id, state, dispatch);
    } else if (stripeSource && type === "invoicePayment") {
      payInvoice(new StripeGateway(), stripeSource.id, dispatch);
    }
  };

  const handlePaymentError = (error) => {
    if (
      error.type === "validation_error" &&
      // Subscription creation & renewal
      type === "createPayment"
    ) {
      const { updatedPrice } = state;
      // When price is 0, we allow submitting without card info
      if (
        updatedPrice === 0 &&
        state.couponObject?.duration === "forever"
      ) {
        return subscribe({}, state, dispatch);
      }
    }

    onFailure(error);
    dispatch({
      type: SHOW_ALERT,
      payload: {
        type: "error",
        content: getErrorMessages(error) ?? error?.message
      }
    });
    dispatch({ type: DISABLE_SUBMIT, payload: false });
    dispatch({ type: LOADING, payload: false });
  };

  const retrieveSource = async (
    sourceId,
    clientSecret,
    paymentHandler
  ) => {
    try {
      const { source } = await stripe.retrieveSource({
        id: sourceId,
        client_secret: clientSecret
      });

      if (source?.status === "failed") {
        return handlePaymentError({
          error: {
            message: t("messages.cardAuthFailed")
          }
        });
      }

      if (source?.status === "chargeable") {
        paymentHandler(source);
      }
    } catch (error) {
      handlePaymentError(error);
    }
  };

  const toggleAuthenticationPendingView = (show, source) => {
    const cardAuthContainer = document.querySelector(
      ".card-authentication-container"
    );

    if (show) {
      injectCardAuthenticationIframe(source);
      cardAuthContainer.classList.remove("plc-hidden");
      cardAuthContainer.classList.add("plc-flex");
    } else {
      cardAuthContainer.classList.add("plc-hidden");
      cardAuthContainer.classList.remove("plc-flex");
    }
  };

  const injectCardAuthenticationIframe = (source) => {
    const cardAuthContainer = document.querySelector(
      ".card-authentication-container"
    );

    const iframe = document.createElement("iframe");
    iframe.src = source?.redirect?.url
      ? source.redirect.url
      : source.threeDSecure_url;
    iframe.style =
      "position: absolute; width: 100%; height: 100%; left: 0; top: 0; bottom: 0; z-index: 10;";

    cardAuthContainer.appendChild(iframe);
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case DISABLE_SUBMIT:
          return Update({ ...state, disableSubmit: action.payload });

        case LOADING:
          return Update({ ...state, isLoading: action.payload });

        case SHOW_COUPON_FIELD:
          return Update({
            ...state,
            enableCouponField: action.payload
          });

        case DISABLE_COUPON_BUTTON:
          return Update({
            ...state,
            disableCouponButton: action.payload
          });

        case SUBSCRIBE:
          return SideEffect((state, dispatch) =>
            subscribe(action.payload, state, dispatch)
          );

        case INIT_CONTAINER:
          return UpdateWithSideEffect(
            { ...state, currentPlan: plan },
            (state, dispatch) => initPaymentRequest(state, dispatch)
          );

        case UPDATE_PAYMENT_REQUEST:
          return UpdateWithSideEffect(state, (state, dispatch) =>
            updatePaymentRequest(state, dispatch)
          );

        case SUBMIT_PAYMENT:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true, isLoading: true },
            (state, dispatch) => {
              if (getSiteCardProcessor() === "vantiv") {
                return submitUsingVantiv();
              }

              if (getSiteCardProcessor() === "tap") {
                return submitUsingTap(state, dispatch);
              }

              if (selectedPaymentMethodId) {
                // pay with selected method (source) if exists already
                return handlePayment(
                  {
                    id: selectedPaymentMethodId,
                    isExistingSource: true
                  },
                  state,
                  dispatch
                );
              }

              if (type === "updatePaymentSource") {
                return updatePaymentSource(state, dispatch);
              }

              submitPayment(state, dispatch);
            }
          );

        case HANDLE_PAYPAL_SUBSCRIPTION:
          return UpdateWithSideEffect(state, (state, dispatch) => {
            if (type === "invoicePayment") {
              payInvoice(
                new PaypalGateway(),
                action.payload,
                dispatch
              );
            } else {
              handlePaypalSubscription(state, action.payload);
            }
          });

        case SET_UPDATED_PRICE:
          return Update({ ...state, updatedPrice: action.payload });

        case SET_TAX_AMOUNT:
          return Update({ ...state, taxAmount: action.payload });

        case SET_CAN_MAKE_PAYMENT:
          return Update({ ...state, canMakePayment: action.payload });

        case SET_PAYMENT_REQUEST:
          return Update({ ...state, paymentRequest: action.payload });

        case APPLY_COUPON_CODE:
          return UpdateWithSideEffect(
            { ...state, disableCouponButton: true },
            (state, dispatch) => onApplyCouponCode(state, dispatch)
          );

        case REMOVE_APPLIED_COUPON:
          return UpdateWithSideEffect(state, () =>
            removeAppliedCoupon(state)
          );

        case SET_COUPON:
          return Update({ ...state, couponObject: action.payload });

        case SET_COUPON_ERROR:
          return Update({ ...state, couponError: action.payload });

        case UPDATE_COUPON_CODE:
          return UpdateWithSideEffect(
            { ...state, couponCode: action.payload },
            (state, dispatch) =>
              debouncedApplyCouponCode(state, dispatch)
          );
        case SET_PERCENT_OFF:
          return Update({ ...state, percentOff: action.payload });

        case SET_FIRST_NAME:
          return Update({
            ...state,
            firstName: action.payload,
            firstNameError: null
          });

        case SET_LAST_NAME:
          return Update({
            ...state,
            lastName: action.payload,
            lastNameError: null
          });

        case SET_PHONE:
          return Update({
            ...state,
            phone: action.payload,
            phoneError: null
          });

        case SET_FIRST_NAME_ERROR:
          return Update({
            ...state,
            firstNameError: action.payload,
            firstName: ""
          });

        case SET_LAST_NAME_ERROR:
          return Update({
            ...state,
            lastNameError: action.payload,
            lastName: ""
          });

        case SET_PHONE_ERROR:
          return Update({
            ...state,
            phoneError: action.payload,
            phone: null
          });

        case SHOW_ALERT:
          return Update({
            ...state,
            alert: action.payload
          });

        default:
          return state;
      }
    },
    initialState
  );

  return (
    <div
      style={{ ...style }}
      className={`pelcro-container pelcro-payment-container ${className}`}
    >
      <Provider value={{ state, dispatch }}>
        {children.length
          ? children.map((child, i) =>
              React.cloneElement(child, { store, key: i })
            )
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

const UnwrappedForm = injectStripe(
  PaymentMethodContainerWithoutStripe
);

const PaymentMethodContainer = (props) => {
  const [isStripeLoaded, setIsStripeLoaded] = useState(
    Boolean(window.Stripe)
  );

  useEffect(() => {
    if (!window.Stripe) {
      document
        .querySelector('script[src="https://js.stripe.com/v3"]')
        .addEventListener("load", () => {
          setIsStripeLoaded(true);
        });
    }
  }, []);

  if (isStripeLoaded) {
    return (
      <StripeProvider
        apiKey={window.Pelcro.environment.stripe}
        stripeAccount={window.Pelcro.site.read().account_id}
        locale={getPageOrDefaultLanguage()}
      >
        <Elements>
          <UnwrappedForm store={store} {...props} />
        </Elements>
      </StripeProvider>
    );
  }
  return null;
};

export { PaymentMethodContainer, store };
