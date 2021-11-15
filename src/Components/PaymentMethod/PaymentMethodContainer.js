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
  SUBSCRIBE
} from "../../utils/action-types";
import { getErrorMessages, debounce } from "../common/Helpers";
import {
  Subscription,
  PaypalGateWay,
  SUBSCRIPTION_TYPES
} from "../../services/Subscription/Subscription.service";
import { getCanonicalLocaleFormat } from "../../utils/utils";
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
  const { set, order, selectedPaymentMethodId } = usePelcro();

  const product = props.product ?? pelcroStore.product;
  const plan = props.plan ?? pelcroStore.plan;
  const subscriptionIdToRenew =
    props.subscriptionIdToRenew ?? pelcroStore.subscriptionIdToRenew;
  const selectedAddressId =
    props.selectedAddressId ?? pelcroStore.selectedAddressId;
  const giftRecipient =
    props.giftRecipient ?? pelcroStore.giftRecipient;
  const isRenewingGift =
    props.isRenewingGift ?? pelcroStore.isRenewingGift;

  useEffect(() => {
    if (window.Pelcro.coupon.getFromUrl()) {
      dispatch({
        type: UPDATE_COUPON_CODE,
        payload: window.Pelcro.coupon.getFromUrl()
      });
    }
    dispatch({ type: INIT_CONTAINER });
    updateTotalAmountWithTax();
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
        "Google Pay/Apple pay isn't available in this country"
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
        dispatch({ type: SET_PERCENT_OFF, payload: "" });
        onFailure(err);

        return dispatch({
          type: SET_COUPON_ERROR,
          payload: getErrorMessages(err)
        });
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

    return subscription.execute(
      {
        type: SUBSCRIPTION_TYPES.CREATE_SUBSCRIPTION,
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

  const purchase = (stripeSource, state, dispatch) => {
    const isQuickPurchase = !Array.isArray(order);
    const mappedOrderItems = isQuickPurchase
      ? [{ sku_id: order.id, quantity: order.quantity }]
      : order.map((item) => ({
          sku_id: item.id,
          quantity: item.quantity
        }));

    const { couponCode } = state;

    window.Pelcro.ecommerce.order.create(
      {
        source_id: stripeSource.isExistingSource
          ? stripeSource.id
          : undefined,
        stripe_token: !stripeSource.isExistingSource
          ? stripeSource.id
          : undefined,
        items: mappedOrderItems,
        coupon_code: couponCode,
        ...(selectedAddressId && { address_id: selectedAddressId })
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
            message: t("messages.cardAuthNotSupported")
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
          state?.updatedPrice ?? plan?.amount ?? getOrderItemsTotal();

        if (
          source?.card?.three_d_secure === "required" &&
          totalAmount > 0
        ) {
          return resolveTaxCalculation().then((res) =>
            generate3DSecureSource(
              source,
              res?.totalAmountWithTax ?? totalAmount
            ).then(({ source, error }) => {
              if (error) {
                return handlePaymentError(error);
              }

              toggleAuthenticationPendingView(true, source);
            })
          );
        }

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
        plan?.currency || window.Pelcro.site.read().default_currency,
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
      payload: { type: "error", content: error?.message }
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
          message: t("messages.cardAuthFailed")
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
