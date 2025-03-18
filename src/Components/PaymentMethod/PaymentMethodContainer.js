import React, {
  createContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
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
  SET_MONTH,
  SET_YEAR,
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
  SET_PHONE_ERROR,
  UPDATE_CYBERSOURCE_SESSION_ID,
  HANDLE_APPLEPAY_SUBSCRIPTION,
  HANDLE_CHECKBOX_CHANGE,
  SET_IS_DEFAULT_PAYMENT_METHOD
} from "../../utils/action-types";
import {
  getErrorMessages,
  debounce,
  getSiteCardProcessor,
  getFourDigitYear
} from "../common/Helpers";
import {
  Payment,
  StripeGateway,
  PaypalGateway,
  VantivGateway,
  TapGateway,
  CybersourceGateway,
  PAYMENT_TYPES
} from "../../services/Subscription/Payment.service";
import { refreshUser, notifyBugsnag } from "../../utils/utils";
import { usePelcro } from "../../hooks/usePelcro";
import { Loader } from "../../SubComponents/Loader";
import { orderSummaryRequest } from "../OrderCreate/OrderCreateView";

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
  month: "",
  year: "",
  cyberSourceSessionId: null,
  isDefault: false,
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
  type,
  onSuccess = () => { },
  onGiftRenewalSuccess = () => { },
  onFailure = () => { },
  ...props
}) => {
  // Get a reference to Stripe or Elements using hooks.
  const stripe = useStripe();
  const elements = useElements();
  const [vantivPaymentRequest, setVantivPaymentRequest] =
    useState(null);
  const [updatedCouponCode, setUpdatedCouponCode] = useState("");
  const { t } = useTranslation("payment");
  const pelcroStore = usePelcro();
  const {
    set,
    order,
    selectedPaymentMethodId,
    couponCode,
    paymentMethodToEdit,
    paymentMethodToDelete
  } = usePelcro();
  const { whenUserReady } = usePelcro.getStore();

  const product = props.product ?? pelcroStore.product;
  const plan = props.plan ?? pelcroStore.plan;
  const subscriptionIdToRenew =
    props.subscriptionIdToRenew ?? pelcroStore.subscriptionIdToRenew;
  const selectedAddressId =
    props.selectedAddressId ?? pelcroStore.selectedAddressId;
  const selectedBillingAddressId =
    props.selectedBillingAddressId ??
    pelcroStore.selectedBillingAddressId;
  const giftRecipient =
    props.giftRecipient ?? pelcroStore.giftRecipient;
  const isGift = props.isGift ?? pelcroStore.isGift;
  const isRenewingGift =
    props.isRenewingGift ?? pelcroStore.isRenewingGift;
  const invoice = props.invoice ?? pelcroStore.invoice;
  const skipPayment =
    window.Pelcro?.uiSettings?.skipPaymentForFreePlans;

  const cardProcessor = getSiteCardProcessor();

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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ====== Start Cybersource integration ======== */
  const cybersourceErrorHandle = (err) => {
    if (err?.details?.responseStatus?.details?.length > 0) {
      const errorMessages = [];

      // enumerable error (ex: validation errors)
      Object.values(err?.details?.responseStatus?.details).forEach(
        ({ message }) => {
          errorMessages.push(message);
        }
      );

      // convert to multiline string
      return errorMessages.join("\n");
    } else {
      return getErrorMessages(err?.details?.responseStatus);
    }
  };

  const submitUsingCybersource = (state, dispatch) => {
    console.log("State", state);

    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );
    if (isUsingExistingPaymentMethod) {
      // no need to create a new source using cybersrce
      return handleCybersourcePayment(null, state);
    }

    if (!cybersourceInstanceRef.current) {
      return console.error(
        "Cybersource sdk script wasn't loaded, you need to load Cybersource sdk before rendering the Cybersource payment flow"
      );
    }

    const options = {
      cardExpirationMonth: state.month,
      cardExpirationYear: state.year
    };

    cybersourceInstanceRef.current?.createToken(
      options,
      function (err, response) {
        if (err) {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
          return dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "error",
              content: cybersourceErrorHandle(err)
            }
          });
        }
        handleCybersourcePayment(response.token, state);
      }
    );
  };

  function handleCybersourcePayment(paymentRequest, state) {
    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );

    if (type === "createPayment") {
      handleCybersourceSubscription();
    } else if (type === "orderCreate") {
      purchase(
        new CybersourceGateway(),
        isUsingExistingPaymentMethod
          ? selectedPaymentMethodId
          : paymentRequest,
        state,
        dispatch
      );
    } else if (type === "invoicePayment") {
      payInvoice(
        new CybersourceGateway(),
        isUsingExistingPaymentMethod
          ? selectedPaymentMethodId
          : paymentRequest,
        dispatch
      );
    } else if (
      type === "createPaymentSource" ||
      type === "updatePaymentSource"
    ) {
      createNewCybersourceCard();
    }

    function createNewCybersourceCard() {
      window.Pelcro.source.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          token: paymentRequest,
          gateway: "cybersource"
        },
        (err, res) => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
          toggleAuthenticationSuccessPendingView(false);

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
        } //
      );
    }

    function handleCybersourceSubscription() {
      const payment = new Payment(new CybersourceGateway());

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
            addressId: selectedAddressId,
            fingerprint_session_id: state.cyberSourceSessionId
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

  const tokenizeCard = (error, microformInstance) => {
    if (error) {
      return;
    }

    cybersourceInstanceRef.current = microformInstance;
  };

  const appendCybersourceFingerprintScripts = () => {
    const uniqueId = crypto.randomUUID();
    const sessionID =
      window.Pelcro.site.read()?.cybersource_gateway_settings
        ?.merchant_id + uniqueId;
    const orgID =
      window.Pelcro.site.read()?.cybersource_gateway_settings?.org_id;

    const fingerPrintScript = document.querySelector(
      `script[src="https://h.online-metrix.net/fp/tags.js?org_id=${orgID}&session_id=${sessionID}"]`
    );
    const fingerPringIframe = document.querySelector(
      `iframe[src="https://h.online-metrix.net/fp/tags?org_id=${orgID}&session_id=${sessionID}"]`
    );

    if (!fingerPrintScript && !fingerPringIframe) {
      window.Pelcro.helpers.loadSDK(
        `https://h.online-metrix.net/fp/tags.js?org_id=${orgID}&session_id=${sessionID}`,
        "cybersource-fingerprint-script"
      );

      const body = document.getElementsByTagName("body")[0];
      const noscript = document.createElement("noscript");
      const iframe = document.createElement("iframe");
      iframe.style.cssText =
        "width: 100px; height: 100px; border: 0; position:absolute; top: -5000px;";
      iframe.src = `https://h.online-metrix.net/fp/tags?org_id=${orgID}&session_id=${sessionID}`;
      noscript.appendChild(iframe);
      body.insertBefore(noscript, body.firstChild);

      dispatch({
        type: UPDATE_CYBERSOURCE_SESSION_ID,
        payload: uniqueId
      });
    }
  };

  const initCybersourceScript = () => {
    // jwk api call
    window.Pelcro.payment.getJWK(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        site_id: window.Pelcro.siteid
      },
      (err, res) => {
        if (err) {
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
        }

        const { key: jwk } = res;
        // SETUP MICROFORM
        // eslint-disable-next-line no-undef
        FLEX.microform(
          {
            keyId: jwk.kid,
            keystore: jwk,
            container: "#cybersourceCardNumber",
            placeholder: "Card Number",
            styles: {
              input: {
                "font-size": "14px",
                "font-family":
                  "helvetica, tahoma, calibri, sans-serif",
                color: "#555"
              },
              ":focus": { color: "blue" },
              ":disabled": { cursor: "not-allowed" },
              valid: { color: "#3c763d" },
              invalid: { color: "#a94442" }
            }
          },
          tokenizeCard
        );
      }
    );
  };

  /* ====== End Cybersource integration ======== */

  /* ====== Start Tap integration ======== */
  const submitUsingTap = (state) => {
    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );
    if (isUsingExistingPaymentMethod) {
      // no need to create a new source using tap
      return handleTapPayment(null, state);
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
      getOrderItemsTotal() ??
      10;

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
          window.Pelcro.payment.verify(
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
              funding: result.card.funding,
              redirect_url: `${window.Pelcro.environment.domain
                }/webhook/tap/callback/3dsecure?auth_token=${window.Pelcro.user.read().auth_token
                }&type=verify_card&site_id=${window.Pelcro.siteid}`
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
                      const { tapID } = data;
                      toggleAuthenticationPendingView(false);
                      toggleAuthenticationSuccessPendingView(true);

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

                      handleTapPayment(tapID, state);
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

  function handleTapPayment(paymentRequest, state) {
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
    } else if (
      type === "createPaymentSource" ||
      type === "updatePaymentSource"
    ) {
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
          toggleAuthenticationSuccessPendingView(false);

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
        } //
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

  const initTapScript = () => {
    const tapKey = window.Tapjsli(
      window.Pelcro.site.read()?.tap_gateway_settings.publishable_key
    );

    const elements = tapKey.elements({});

    const style = {
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
    const labels = {
      cardNumber: "Card Number",
      expirationDate: "MM/YY",
      cvv: "CVV",
      cardHolder: "Card Holder Name"
    };

    // payment options
    const paymentOptions = {
      labels: labels,
      TextDirection: "ltr"
    };

    // create element, pass style and payment options
    const card = elements.create(
      "card",
      { style: style },
      paymentOptions
    );

    // mount element
    card.mount("#tapPaymentIframe");

    // card change event listener
    card.addEventListener("change", function (event) {
      // If needed
    });

    tapInstanceRef.current = tapKey;
    tapInstanceCard.current = card;
  };
  /* ====== End Tap integration ======== */

  const submitUsingVantiv = (state) => {
    const isUsingExistingPaymentMethod = Boolean(
      selectedPaymentMethodId
    );
    if (isUsingExistingPaymentMethod) {
      // no need to create a new source using vantiv
      return handleVantivPayment(null, state.couponCode);
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

  function handleVantivPayment(paymentRequest, couponCode) {
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
    } else if (type === "createPaymentSource") {
      createNewVantivCard();
    } else if (type === "updatePaymentSource") {
      updateVantivCard();
    } else if (type === "deletePaymentSource") {
      replaceVantivCard();
    }

    function createNewVantivCard() {
      window.Pelcro.paymentMethods.create(
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
              content: t("messages.sourceCreated")
            }
          });
          refreshUser();
          onSuccess(res);
        }
      );
    }

    function replaceVantivCard() {
      const { id: paymentMethodId } = paymentMethodToDelete;

      window.Pelcro.paymentMethods.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          token: paymentRequest,
          gateway: "vantiv"
        },
        (err, res) => {
          if (err) {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
            onFailure(err);
            return dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(err)
              }
            });
          }

          if (res) {
            setTimeout(() => {
              window.Pelcro.paymentMethods.deletePaymentMethod(
                {
                  auth_token: window.Pelcro.user.read().auth_token,
                  payment_method_id: paymentMethodId
                },
                (err, res) => {
                  dispatch({ type: DISABLE_SUBMIT, payload: false });
                  dispatch({ type: LOADING, payload: false });
                  if (err) {
                    onFailure?.(err);
                    return dispatch({
                      type: SHOW_ALERT,
                      payload: {
                        type: "error",
                        content: getErrorMessages(err)
                      }
                    });
                  }

                  refreshUser();
                  onSuccess(res);
                }
              );
            }, 2000);
          }
        }
      );
    }

    function updateVantivCard() {
      const { id: paymentMethodId } = paymentMethodToEdit;

      const {
        paypageRegistrationId,
        bin,
        type,
        firstSix,
        lastFour,
        expMonth,
        expYear
      } = paymentRequest;

      const { isDefault } = state;

      const fourDigitExpYear = getFourDigitYear(
        Number(expYear)
      ).toString();
      window.Pelcro.paymentMethods.update(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          payment_method_id: paymentMethodId,
          gateway: "vantiv",
          paypageRegistrationId: paypageRegistrationId,
          bin: bin,
          type: type,
          firstSix: firstSix,
          lastFour: lastFour,
          exp_month: expMonth,
          exp_year: fourDigitExpYear,
          is_default: isDefault
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
          refreshUser();
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
  const cybersourceInstanceRef = React.useRef(null);

  useEffect(() => {
    if (skipPayment && (plan?.amount === 0 || props?.freeOrders))
      return;
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
        style: "enhancedStyle5",
        height: "245",
        timeout: 50000,
        div: "eProtectiframe",
        callback: (paymentRequest) =>
          setVantivPaymentRequest(paymentRequest),
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
  }, [selectedPaymentMethodId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger the handleVantivPayment method when a vantivPaymentRequest is present
  useEffect(() => {
    if (vantivPaymentRequest) {
      handleVantivPayment(vantivPaymentRequest, updatedCouponCode);
    }
  }, [vantivPaymentRequest]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    whenUserReady(() => {
      if (skipPayment && (plan?.amount === 0 || props?.freeOrders))
        return;
      if (cardProcessor === "tap" && !window.Tapjsli) {
        window.Pelcro.helpers.loadSDK(
          "https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js",
          "tap-bluebird"
        );

        window.Pelcro.helpers.loadSDK(
          "https://secure.gosell.io/js/sdk/tap.min.js",
          "tap-sdk"
        );

        document
          .querySelector(
            'script[src="https://secure.gosell.io/js/sdk/tap.min.js"]'
          )
          .addEventListener("load", () => {
            initTapScript();
          });
      }

      if (
        cardProcessor === "tap" &&
        !selectedPaymentMethodId &&
        window.Tapjsli
      ) {
        initTapScript();
      }

      if (
        cardProcessor === "cybersource" &&
        !selectedPaymentMethodId &&
        !window.FLEX
      ) {
        window.Pelcro.helpers.loadSDK(
          "https://flex.cybersource.com/cybersource/assets/microform/0.4/flex-microform.min.js",
          "cybersource-cdn"
        );

        document
          .querySelector(
            'script[src="https://flex.cybersource.com/cybersource/assets/microform/0.4/flex-microform.min.js"]'
          )
          .addEventListener("load", () => {
            initCybersourceScript();
          });
      }

      if (
        cardProcessor === "cybersource" &&
        !selectedPaymentMethodId &&
        window.FLEX
      ) {
        initCybersourceScript();
      }

      if (cardProcessor === "cybersource") {
        appendCybersourceFingerprintScripts();
      }
    });
  }, [selectedPaymentMethodId]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ====== Start Stripe integration ======== */

  // useEffect(() => {
  //   if (!selectedBillingAddressId) {
  //     const defaultAddress = window?.Pelcro?.user
  //       ?.read()
  //       ?.addresses?.find(
  //         (address) => address.type == "billing" && address.is_default
  //       );
  //     if (defaultAddress) {
  //       set({ selectedBillingAddressId: defaultAddress.id });
  //     }
  //   }
  // }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const billingAddress = selectedBillingAddressId
    ? window?.Pelcro?.user
      ?.read()
      ?.addresses?.find(
        (address) => address.id == selectedBillingAddressId
      ) ?? {}
    : window?.Pelcro?.user
      ?.read()
      ?.addresses?.find(
        (address) => address.type == "billing" && address.is_default
      ) ?? {};

  const billingDetails = {
    address: {
      line1: billingAddress?.line1 ?? null,
      line2: billingAddress?.line2 ?? null,
      city: billingAddress?.city ?? null,
      state: billingAddress?.state ?? null,
      country: billingAddress?.country ?? null,
      postal_code: billingAddress?.postal_code ?? null
    }
  };

  const initPaymentRequest = (state, dispatch) => {
    if (skipPayment && (plan?.amount === 0 || props?.freeOrders))
      return;
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
   * Attempt to confirm a Stripe card payment via it's PaymentIntent.
   * Only trigger method if PaymentIntent status is `requires_action`.
   *
   * @see https://stripe.com/docs/payments/intents#intent-statuses
   *
   * @param {Object} response
   * @param {Object} error
   * @param {boolean} isSubCreate
   * @return {*}
   */
  const confirmStripeCardPayment = async (
    response,
    error,
    isSubCreate = false
  ) => {
    try {
      if (response) {
        const paymentIntent = response.data?.payment_intent;

        if (
          paymentIntent?.status === "requires_action" &&
          paymentIntent?.client_secret
        ) {
          const res = await stripe.confirmCardPayment(
            paymentIntent.client_secret
          );

          if (!isSubCreate) {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
          }
          dispatch({ type: LOADING, payload: false });

          if (res.error) {
            notifyBugsnag(() => {
              // eslint-disable-next-line no-undef
              Bugsnag.notify(`Payment ${res.error}`, (event) => {
                event.addMetadata("Stripe Error MetaData", {
                  message: res.error.message,
                  type: res.error.type,
                  code: res.error.code,
                  error_message:
                    error?.response?.data?.error?.message,
                  site: window.Pelcro?.site?.read(),
                  user: window.Pelcro?.user?.read(),
                  environment: window.Pelcro?.environment
                });
              });
            });

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
        } else if (
          paymentIntent?.status === "requires_payment_method" &&
          paymentIntent?.client_secret
        ) {
          if (!isSubCreate) {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
          }
          dispatch({ type: LOADING, payload: false });

          onFailure(error);
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
          notifyBugsnag(() => {
            // eslint-disable-next-line no-undef
            Bugsnag.notify(`Payment ${error}`, (event) => {
              event.addMetadata("MetaData", {
                name: error?.name,
                message: error?.message,
                type: error?.type,
                code: error?.code,
                status: error?.response?.status,
                error_message: error?.response?.data?.error?.message,
                site: window.Pelcro?.site?.read(),
                user: window.Pelcro?.user?.read(),
                environment: window.Pelcro?.environment
              });
            });
          });

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
    } catch (error) {
      notifyBugsnag(() => {
        // eslint-disable-next-line no-undef
        Bugsnag.notify(`Payment ${error}`, (event) => {
          event.addMetadata("UnexpectedError", {
            message: error.message,
            stack: error.stack,
            error_message: error?.response?.data?.error?.message,
            site: window.Pelcro?.site?.read(),
            user: window.Pelcro?.user?.read(),
            environment: window.Pelcro?.environment
          });
        });
      });

      dispatch({ type: DISABLE_SUBMIT, payload: false });
      dispatch({ type: LOADING, payload: false });

      onFailure(error);
      return dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: t("messages.unexpectedError")
        }
      });
    }
  };

  const confirmStripeIntentSetup = (
    response,
    flow,
    paymentMethodId,
    hiddenSetAsDefault = false
  ) => {
    const setupIntent = response.data?.setup_intent;
    if (
      setupIntent?.status === "requires_action" &&
      setupIntent?.client_secret
    ) {
      stripe
        .confirmCardSetup(setupIntent.client_secret, {
          payment_method: response.data?.source?.object_id
        })
        .then((res) => {
          if (res.error) {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
            onFailure(res.error);
            return dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "error",
                content: getErrorMessages(res.error)
              }
            });
          }

          if (flow === "subCreate") {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
            refreshUser();
            onSuccess(res);
            // if success, set as default if hiddenSetAsDefault is true
            if (hiddenSetAsDefault) {
              window.Pelcro.paymentMethods.update(
                {
                  auth_token: window.Pelcro.user.read().auth_token,
                  payment_method_id: paymentMethodId,
                  is_default: true
                },
                (err, res) => {
                  if (err) {
                    onFailure(err);
                  }
                }
              );
            }
            return;
          }

          if (flow === "create") {
            dispatch({ type: LOADING, payload: false });

            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "success",
                content: t("messages.sourceCreated")
              }
            });
            // if success, set as default if hiddenSetAsDefault is true
            if (hiddenSetAsDefault) {
              window.Pelcro.paymentMethods.update(
                {
                  auth_token: window.Pelcro.user.read().auth_token,
                  payment_method_id: paymentMethodId,
                  is_default: true
                },
                (err, res) => {
                  if (err) {
                    onFailure(err);
                  }
                }
              );
            }
            refreshUser();
            onSuccess(res);
            return;
          }

          if (flow === "update") {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });

            dispatch({
              type: SHOW_ALERT,
              payload: {
                type: "success",
                content: t("messages.sourceUpdated")
              }
            });
            refreshUser();
            onSuccess(res);
            return;
          }

          if (flow === "replace") {
            setTimeout(() => {
              window.Pelcro.paymentMethods.deletePaymentMethod(
                {
                  auth_token: window.Pelcro.user.read().auth_token,
                  payment_method_id: paymentMethodId
                },
                (err, res) => {
                  dispatch({
                    type: DISABLE_SUBMIT,
                    payload: false
                  });
                  dispatch({ type: LOADING, payload: false });
                  if (err) {
                    onFailure?.(err);
                    return dispatch({
                      type: SHOW_ALERT,
                      payload: {
                        type: "error",
                        content: getErrorMessages(err)
                      }
                    });
                  }
                  refreshUser();
                  onSuccess(res);
                }
              );
            }, 2000);
            return;
          }



          return handlePayment(response?.data?.source);
        });
    } else {
      onSuccess(response);
    }
  };

  const subscribe = (stripeSource, state, dispatch) => {
    const { couponCode } = state;

    if (!subscriptionIdToRenew) {
      window.Pelcro.subscription.create(
        {
          source_id: stripeSource?.isExistingSource
            ? stripeSource?.id
            : undefined,
          stripe_token: !stripeSource?.isExistingSource
            ? stripeSource?.id
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
          if (res?.data?.setup_intent) {
            return confirmStripeIntentSetup(res, "subCreate",
              res.data?.id,
              props?.hiddenSetAsDefault);
          }
          confirmStripeCardPayment(res, err, true);
        }
      );
    } else {
      if (isRenewingGift) {
        window.Pelcro.subscription.renewGift(
          {
            source_id: stripeSource?.isExistingSource
              ? stripeSource?.id
              : undefined,
            stripe_token: !stripeSource?.isExistingSource
              ? stripeSource?.id
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
            source_id: stripeSource?.isExistingSource
              ? stripeSource?.id
              : undefined,
            stripe_token: !stripeSource?.isExistingSource
              ? stripeSource?.id
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
      (err, orderResponse) => {
        if (err) {
          toggleAuthenticationSuccessPendingView(false);
          dispatch({ type: DISABLE_SUBMIT, payload: false });
          dispatch({ type: LOADING, payload: false });
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

        window.Pelcro.user.refresh(
          {
            auth_token: window.Pelcro?.user?.read()?.auth_token
          },
          (err, res) => {
            dispatch({ type: DISABLE_SUBMIT, payload: false });
            dispatch({ type: LOADING, payload: false });
            toggleAuthenticationSuccessPendingView(false);
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
            onSuccess(orderResponse);
          }
        );
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

  const createPaymentSource = async (state, dispatch) => {
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handlePaymentError(submitError);
      return;
    }

    return stripe
      .createPaymentMethod({
        elements,
        params: {
          billing_details: billingDetails
        }
      })
      .then((result) => {
        if (result.error) {
          return handlePaymentError(result.error);
        }

        if (result.paymentMethod) {
          window.Pelcro.paymentMethods.create(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              token: result.paymentMethod.id
            },
            (err, res) => {
              if (err) {
                dispatch({ type: DISABLE_SUBMIT, payload: false });
                dispatch({ type: LOADING, payload: false });
                onFailure(err);
                return dispatch({
                  type: SHOW_ALERT,
                  payload: {
                    type: "error",
                    content: getErrorMessages(err)
                  }
                });
              }

              if (
                res.data?.setup_intent?.status ===
                "requires_action" ||
                res.data?.setup_intent?.status ===
                "requires_confirmation"
              ) {
                confirmStripeIntentSetup(res, "create",
                  res.data?.id,
                  props?.hiddenSetAsDefault);
              } else {
                if (props?.hiddenSetAsDefault) {
                  window.Pelcro.paymentMethods.update(
                    {
                      auth_token:
                        window.Pelcro.user.read().auth_token,
                      payment_method_id: res.data?.id,
                      gateway: "stripe",
                      exp_month: res.data?.properties.exp_month,
                      exp_year: res.data?.properties.exp_year,
                      is_default: true
                    },
                    (err, res) => {
                      dispatch({
                        type: DISABLE_SUBMIT,
                        payload: false
                      });
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

                      if (
                        res.data?.setup_intent?.status ===
                        "requires_action" ||
                        res.data?.setup_intent?.status ===
                        "requires_confirmation"
                      ) {
                        confirmStripeIntentSetup(res, "update",
                          res.data?.id,
                          props?.hiddenSetAsDefault);
                      } else {
                        dispatch({ type: LOADING, payload: false });
                        dispatch({
                          type: SHOW_ALERT,
                          payload: {
                            type: "success",
                            content: t("messages.sourceCreated")
                          }
                        });
                        refreshUser();
                        onSuccess(res);
                      }
                    }
                  );
                } else {
                  dispatch({ type: LOADING, payload: false });
                  dispatch({
                    type: SHOW_ALERT,
                    payload: {
                      type: "success",
                      content: t("messages.sourceCreated")
                    }
                  });
                  refreshUser();
                  onSuccess(res);
                }
              }
            }
          );
        }
      });
  };

  const updatePaymentSource = (state, dispatch) => {
    const { isDefault, month, year } = state;
    const { id: paymentMethodId } = paymentMethodToEdit;
    window.Pelcro.paymentMethods.update(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        payment_method_id: paymentMethodId,
        gateway: "stripe",
        exp_month: month,
        exp_year: year,
        is_default: isDefault
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

        if (
          res.data?.setup_intent?.status === "requires_action" ||
          res.data?.setup_intent?.status === "requires_confirmation"
        ) {
          confirmStripeIntentSetup(res, "update",
            res.data?.id,
            props?.hiddenSetAsDefault);
        } else {
          dispatch({
            type: SHOW_ALERT,
            payload: {
              type: "success",
              content: t("messages.sourceUpdated")
            }
          });
          refreshUser();
          onSuccess(res);
        }
      }
    );
  };

  const replacePaymentSource = async (state, dispatch) => {
    const { id: paymentMethodId } = paymentMethodToDelete;
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handlePaymentError(submitError);
      return;
    }

    return stripe
      .createPaymentMethod({
        elements,
        params: {
          billing_details: billingDetails
        }
      })
      .then((result) => {
        if (result.error) {
          return handlePaymentError(result.error);
        }

        if (result.paymentMethod) {
          window.Pelcro.paymentMethods.create(
            {
              auth_token: window.Pelcro.user.read().auth_token,
              token: result.paymentMethod.id
            },
            (err, res) => {
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

              if (
                res.data?.setup_intent?.status ===
                "requires_action" ||
                res.data?.setup_intent?.status ===
                "requires_confirmation"
              ) {
                confirmStripeIntentSetup(
                  res,
                  "replace",
                  paymentMethodId,
                  props?.hiddenSetAsDefault
                );
              } else {
                setTimeout(() => {
                  window.Pelcro.paymentMethods.deletePaymentMethod(
                    {
                      auth_token:
                        window.Pelcro.user.read().auth_token,
                      payment_method_id: paymentMethodId
                    },
                    (err, res) => {
                      dispatch({
                        type: DISABLE_SUBMIT,
                        payload: false
                      });
                      dispatch({ type: LOADING, payload: false });
                      if (err) {
                        onFailure?.(err);
                        return dispatch({
                          type: SHOW_ALERT,
                          payload: {
                            type: "error",
                            content: getErrorMessages(err)
                          }
                        });
                      }
                      refreshUser();
                      onSuccess(res);
                    }
                  );
                }, 2000);
              }
            }
          );
        }
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

  const submitPayment = async (state, dispatch) => {
    if (skipPayment && props?.freeOrders) {
      const isQuickPurchase = !Array.isArray(order);
      const mappedOrderItems = isQuickPurchase
        ? [{ sku_id: order.id, quantity: order.quantity }]
        : order.map((item) => ({
          sku_id: item.id,
          quantity: item.quantity
        }));
      window.Pelcro.ecommerce.order.create(
        {
          items: mappedOrderItems,
          campaign_key:
            window.Pelcro.helpers.getURLParameter("campaign_key"),
          ...(selectedAddressId && { address_id: selectedAddressId })
        },
        (err, res) => {
          if (err) {
            return handlePaymentError(err);
          }
          return onSuccess(res);
        }
      );
      return;
    }
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      handlePaymentError(submitError);
      return;
    }

    stripe
      .createPaymentMethod({
        elements,
        params: {
          billing_details: billingDetails
        }
      })
      .then((result) => {
        if (result.error) {
          return handlePaymentError(result.error);
        }
        if (result.paymentMethod) {
          return handlePayment(result.paymentMethod);
        }
      })
      .catch((error) => {
        return handlePaymentError(error);
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
    toggleAuthenticationSuccessPendingView(false);

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

    if (
      error.type == "invalid_request_error" &&
      error.param == "billing_details[address]" &&
      error.code == "parameter_missing"
    ) {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content:
            "Billing address is required to complete your purchase. Please provide your billing address."
        }
      });
    } else {
      dispatch({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: getErrorMessages(error) ?? error?.message
        }
      });
    }

    dispatch({ type: DISABLE_SUBMIT, payload: false });
    dispatch({ type: LOADING, payload: false });
    onFailure(error);
  };

  // TODO: Refactor deprecated stripe implementation

  /* Start Stripe deprecated functions */

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
        return_url: `${window.Pelcro.environment.domain
          }/webhook/stripe/callback/3dsecure?auth_token=${window.Pelcro.user.read().auth_token
          }`
      }
    });
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
      cardAuthContainer?.classList.remove("plc-hidden");
      cardAuthContainer?.classList.add("plc-flex");
    } else {
      cardAuthContainer?.classList.add("plc-hidden");
      cardAuthContainer?.classList.remove("plc-flex");
    }
  };

  const toggleAuthenticationSuccessPendingView = (show) => {
    const cardAuthContainer = document.querySelector(
      ".card-authentication-success-container"
    );

    if (show) {
      cardAuthContainer?.classList.remove("plc-hidden");
      cardAuthContainer?.classList.add("plc-flex");
    } else {
      cardAuthContainer?.classList.add("plc-hidden");
      cardAuthContainer?.classList.remove("plc-flex");
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

    cardAuthContainer?.appendChild(iframe);
  };

  /* End Stripe deprecated functions */

  /* ====== End Stripe integration ======== */

  /* ====== Start PayPal integration ======== */

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

  /* ====== End PayPal integration ======== */

  /* ====== General Functions Start ======== */

  /**
   * Updates the total amount after adding taxes only if site taxes are enabled
   */
  const updateTotalAmountWithTax = () => {
    if (skipPayment && (plan?.amount === 0 || props?.freeOrders))
      return;
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

        // reset the coupon code in local state
        setUpdatedCouponCode("");

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

      // set the coupon code in local state to be able to use with Vantiv
      setUpdatedCouponCode(res.data.coupon.code);

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

        const orderSummaryParams = {
          items: mappedOrderItems,
          coupon_code: couponCode
        };

        if (window.Pelcro.site.read()?.taxes_enabled) {
          orderSummaryParams.address_id = selectedAddressId;
        }

        const onSuccess = (res) => {
          handleCouponResponse(null, res);
        };
        const onFailure = (err) => {
          handleCouponResponse(err, null);
        };

        orderSummaryRequest(orderSummaryParams, onSuccess, onFailure);
      }
    }
  };

  const debouncedApplyCouponCode = useRef(
    debounce(onApplyCouponCode, 1000)
  ).current;

  const removeAppliedCoupon = (state) => {
    state.couponCode = "";

    // reset the coupon code in local state
    setUpdatedCouponCode("");

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
  /* ====== General Functions End ======== */

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
              if (skipPayment && props?.freeOrders) {
                return submitPayment(state, dispatch);
              }

              if (getSiteCardProcessor() === "vantiv") {
                return submitUsingVantiv(state);
              }

              if (getSiteCardProcessor() === "tap") {
                return submitUsingTap(state, dispatch);
              }

              if (getSiteCardProcessor() === "cybersource") {
                return submitUsingCybersource(state, dispatch);
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

              if (type === "createPaymentSource") {
                return createPaymentSource(state, dispatch);
              }

              if (type === "updatePaymentSource") {
                return updatePaymentSource(state, dispatch);
              }

              if (type === "deletePaymentSource") {
                return replacePaymentSource(state, dispatch);
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

        case HANDLE_APPLEPAY_SUBSCRIPTION:
          return UpdateWithSideEffect(state, (state, dispatch) => {
            setVantivPaymentRequest(action.payload);
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

        case SET_MONTH:
          return Update({
            ...state,
            month: action.payload
          });

        case SET_YEAR:
          return Update({
            ...state,
            year: action.payload
          });

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

        case UPDATE_CYBERSOURCE_SESSION_ID:
          return Update({
            ...state,
            cyberSourceSessionId: action.payload
          });

        case HANDLE_CHECKBOX_CHANGE:
          return Update({
            ...state,
            ...action.payload
          });

        case SET_IS_DEFAULT_PAYMENT_METHOD:
          return Update({
            ...state,
            ...action.payload
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
          ? children.map((child, i) => {
            if (child) {
              return React.cloneElement(child, { store, key: i });
            }
          })
          : React.cloneElement(children, { store })}
      </Provider>
    </div>
  );
};

const PaymentMethodContainer = (props) => {
  const [isStripeLoaded, setIsStripeLoaded] = useState(
    Boolean(window.Stripe)
  );
  const { whenUserReady, selectedPaymentMethodId } =
    usePelcro.getStore();
  const cardProcessor = getSiteCardProcessor();

  // Create the Stripe object
  const stripePromise =
    cardProcessor === "stripe"
      ? loadStripe(window.Pelcro.environment.stripe, {
        stripeAccount: window.Pelcro.site.read().account_id
      })
      : null;
  const [clientSecret, setClientSecret] = useState();
  const appearance = {
    theme: "stripe",
    labels: "floating",
    variables: {
      colorPrimary:
        window?.Pelcro?.site?.read()?.design_settings?.primary_color
    }
  };

  const options = {
    clientSecret,
    paymentMethodCreation: "manual",
    appearance,
    loader: "always"
  };

  useEffect(() => {
    if (isStripeLoaded && !selectedPaymentMethodId) {
      window.Pelcro.user.createSetupIntent?.(
        { auth_token: window.Pelcro.user.read().auth_token },
        (err, res) => {
          if (err) {
            console.error(err);
          }
          if (res) {
            setClientSecret(res.data.client_secret);
          }
        }
      );
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    whenUserReady(() => {
      if (!window.Stripe && cardProcessor === "stripe") {
        document
          .querySelector('script[src="https://js.stripe.com/v3"]')
          .addEventListener("load", () => {
            setIsStripeLoaded(true);
          });
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isStripeLoaded) {
    return (
      <div>
        {clientSecret || selectedPaymentMethodId ? (
          <Elements options={options} stripe={stripePromise}>
            <PaymentMethodContainerWithoutStripe
              store={store}
              {...props}
            />
          </Elements>
        ) : (
          <Loader />
        )}
      </div>
    );
  } else if (cardProcessor !== "stripe") {
    return (
      <PaymentMethodContainerWithoutStripe store={store} {...props} />
    );
  }
  return null;
};

export { PaymentMethodContainer, store };
