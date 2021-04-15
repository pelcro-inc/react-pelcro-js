import React, { createContext, useEffect, useRef } from "react";
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
  SET_ORDER,
  SHOW_ALERT,
  SUBSCRIBE
} from "../../utils/action-types";
import { getErrorMessages, debounce } from "../common/Helpers";
import {
  Subscription,
  PaypalGateWay,
  SUBSCRIPTION_TYPES
} from "../../services/Subscription/Subscription.service";
import {
  getCanonicalLocaleFormat,
  getEcommerceOrderTotal,
  getUserLatestAddress
} from "../../utils/utils";

/**
 * @typedef {Object} PaymentStateType
 * @property {boolean} disableSubmit
 * @property {boolean} isLoading
 * @property {boolean} disableCouponButton
 * @property {string} couponCode
 * @property {string} couponError
 * @property {boolean} enableCouponField
 * @property {string} percentOff
 * @property {unknown} canMakePayment
 * @property {unknown} paymentRequest
 * @property {number} updatedPrice
 * @property {object} currentPlan
 * @property {object} order
 * @property {object} alert
 */

/** @type {PaymentStateType} */
const initialState = {
  disableSubmit: false,
  isLoading: false,
  disableCouponButton: false,
  couponCode: "",
  couponError: "",
  enableCouponField: false,
  percentOff: "",
  canMakePayment: false,
  paymentRequest: null,
  updatedPrice: null,
  currentPlan: null,
  order: {},
  alert: {
    type: "error",
    content: ""
  }
};
const store = createContext(initialState);
const { Provider } = store;

const PaymentMethodContainerWithoutStripe = ({
  style,
  className,
  children,
  successMessage,
  stripe,
  type,
  subscriptionIdToRenew,
  isRenewingGift,
  plan,
  product,
  store,
  order = {},
  giftRecipient = null,
  onSuccess = () => {},
  onGiftRenewalSuccess = () => {},
  onFailure = () => {},
  onLoading = () => {},
  onDisplay = () => {}
}) => {
  const { t } = useTranslation("payment");

  useEffect(() => {
    onDisplay();

    window.Pelcro.insight.track("Modal Displayed", {
      name: "payment"
    });

    if (window.Pelcro.coupon.getFromUrl()) {
      dispatch({
        type: UPDATE_COUPON_CODE,
        payload: window.Pelcro.coupon.getFromUrl()
      });
    }
    if (order) {
      dispatch({
        type: SET_ORDER,
        payload: order
      });
    }
    dispatch({ type: INIT_CONTAINER });
  }, []);

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

      paymentRequest.on("token", ({ complete, token, ...data }) => {
        dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        onLoading();
        dispatch({ type: SUBSCRIBE, payload: token });
        complete("success");
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
        "Google Pay/Apple pay isn't available in this country"
      );
    }
  };

  const onApplyCouponCode = (state, dispatch) => {
    dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
    const addressId = getUserLatestAddress()?.id;
    const { couponCode, canMakePayment } = state;

    if (couponCode) {
      window.Pelcro.order.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: plan.id,
          coupon_code: couponCode,
          address_id: addressId
        },
        (err, res) => {
          dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });

          if (err) {
            dispatch({ type: SET_PERCENT_OFF, payload: "" });
            onFailure(err);

            return dispatch({
              type: SET_COUPON_ERROR,
              payload: getErrorMessages(err)
            });
          }

          dispatch({
            type: SHOW_ALERT,
            payload: { type: "error", content: "" }
          });
          dispatch({
            type: SET_PERCENT_OFF,
            payload: `${res.data.coupon?.percent_off}%`
          });

          dispatch({
            type: SET_UPDATED_PRICE,
            payload: res.data.total
          });

          dispatch({ type: UPDATE_PAYMENT_REQUEST });
        }
      );
    }
  };

  const debouncedApplyCouponCode = useRef(
    debounce(onApplyCouponCode, 1000)
  ).current;

  const subscribe = (stripeSource, state, dispatch) => {
    const { couponCode } = state;

    if (!subscriptionIdToRenew) {
      window.Pelcro.subscription.create(
        {
          stripe_token: stripeSource.id,
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: plan.id,
          quantity: plan.quantity,
          coupon_code: couponCode,
          gift_recipient_email: giftRecipient
            ? giftRecipient.email
            : null,
          gift_recipient_first_name: giftRecipient?.firstName,
          gift_recipient_last_name: giftRecipient?.lastName,
          address_id: product.address_required
            ? getUserLatestAddress()?.id
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
    } else {
      if (isRenewingGift) {
        window.Pelcro.subscription.renewGift(
          {
            stripe_token: stripeSource.id,
            auth_token: window.Pelcro.user.read().auth_token,
            plan_id: plan.id,
            quantity: plan.quantity,
            coupon_code: couponCode,
            subscription_id: subscriptionIdToRenew,
            address_id: product.address_required
              ? getUserLatestAddress()?.id
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
            stripe_token: stripeSource.id,
            auth_token: window.Pelcro.user.read().auth_token,
            plan_id: plan.id,
            coupon_code: couponCode,
            subscription_id: subscriptionIdToRenew,
            address_id: product.address_required
              ? getUserLatestAddress()?.id
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
    const subscription = new Subscription(new PaypalGateWay());
    const { couponCode } = state;

    /**
     * @TODO: Add flags for types instead of testing by properties
     */

    if (giftRecipient) {
      return subscription.execute(
        {
          type: SUBSCRIPTION_TYPES.CREATE_GIFTED_SUBSCRIPTION,
          token: paypalNonce,
          quantity: plan.quantity,
          plan,
          couponCode,
          product,
          giftRecipient
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

    return subscription.execute(
      {
        type: SUBSCRIPTION_TYPES.CREATE_SUBSCRIPTION,
        token: paypalNonce,
        quantity: plan.quantity,
        plan,
        couponCode,
        product
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

  const purchase = (token, state, dispatch) => {
    const { order } = state;
    order.email = window.Pelcro.user.read().email;
    const address = window.Pelcro.user.read().addresses
      ? window.Pelcro.user.read().addresses[
          window.Pelcro.user.read().addresses.length - 1
        ]
      : null;

    const addressId = address?.id;

    window.Pelcro.ecommerce.order.create(
      {
        items: order.items,
        stripe_token: token.id,
        ...(addressId && { address_id: addressId })
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

        // Reset cart products
        window.Pelcro.cartProducts = [];
        onSuccess(res);
      }
    );
  };

  const updatePaymentSource = (state, dispatch) => {
    return stripe.createToken().then(({ token, error }) => {
      if (error) {
        return handlePaymentError(error);
      }

      window.Pelcro.source.create(
        {
          auth_token: window.Pelcro.user.read().auth_token,
          token: token.id
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
              content: successMessage
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

        if (source.card.three_d_secure === "required") {
          // listen to injected iframe for authentication complete message
          window.addEventListener("message", (event) => {
            const { data } = event;
            if (data.message === "3DS-authentication-complete") {
              toggleAuthenticationPendingView(false);
              retrieveSource(data.sourceId, data.clientSecret);
            }
          });

          return stripe
            .createSource({
              type: "three_d_secure",
              amount:
                state?.updatedPrice ||
                plan?.amount ||
                getEcommerceOrderTotal(order?.items) ||
                0,
              currency:
                plan?.currency ||
                window.Pelcro.site.read().default_currency,
              three_d_secure: {
                card: source?.id
              },
              redirect: {
                return_url:
                  "https://cocky-williams-cf94f0.netlify.app/"
              }
            })
            .then(({ source, error }) => {
              if (error) {
                return handlePaymentError(error);
              }

              toggleAuthenticationPendingView(true);
              injectCardAuthenticationIframe(source);
            });
        }

        return handlePayment(source);
      });
  };

  const handlePayment = (stripeSource) => {
    if (stripeSource && type === "createPayment") {
      subscribe(stripeSource, state, dispatch);
    } else if (stripeSource && type === "orderCreate") {
      purchase(stripeSource, state, dispatch);
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
      if (updatedPrice === 0) {
        return subscribe({}, state, dispatch);
      }
    }

    onFailure(error);
    dispatch({
      type: SHOW_ALERT,
      payload: { type: "error", content: error?.message }
    });
    dispatch({ type: DISABLE_SUBMIT, payload: false });
    dispatch({ type: LOADING, payload: false });
  };

  const retrieveSource = async (sourceId, clientSecret) => {
    try {
      const { source } = await stripe.retrieveSource({
        id: sourceId,
        client_secret: clientSecret
      });

      if (source.status === "failed") {
        return handlePaymentError({
          message: t("messages.cardAuthFailed")
        });
      }

      if (source.status === "chargeable") {
        handlePayment(source);
      }
    } catch (error) {
      handlePaymentError(error);
    }
  };

  const toggleAuthenticationPendingView = (show) => {
    const cardAuthContainer = document.querySelector(
      ".card-authentication-container"
    );

    if (show) {
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
    iframe.src = source.redirect.url;
    iframe.style =
      "position: absolute; width: 100%; height: 100%; left: 0; top: 40px; bottom: 0; z-index: 10;";

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
              if (type === "updatePaymentSource") {
                updatePaymentSource(state, dispatch);
              } else {
                submitPayment(state, dispatch);
              }
            }
          );

        case HANDLE_PAYPAL_SUBSCRIPTION:
          return UpdateWithSideEffect(state, () =>
            handlePaypalSubscription(state, action.payload)
          );

        case SET_UPDATED_PRICE:
          return Update({ ...state, updatedPrice: action.payload });

        case SET_CAN_MAKE_PAYMENT:
          return Update({ ...state, canMakePayment: action.payload });

        case SET_PAYMENT_REQUEST:
          return Update({ ...state, paymentRequest: action.payload });

        case SET_ORDER:
          return Update({ ...state, order: action.payload });

        case APPLY_COUPON_CODE:
          return UpdateWithSideEffect(
            { ...state, disableCouponButton: true },
            (state, dispatch) => onApplyCouponCode(state, dispatch)
          );

        case SET_COUPON:
          return Update({ ...state, coupon: action.payload });

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
    <div style={{ ...style }} className={className}>
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
  if (window.Stripe) {
    return (
      <StripeProvider
        apiKey={window.Pelcro.environment.stripe}
        stripeAccount={window.Pelcro.site.read().account_id}
        locale={getCanonicalLocaleFormat(
          window.Pelcro.site.read().default_locale
        )}
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
