import React, { createContext, useEffect } from "react";
import {
  injectStripe,
  Elements,
  StripeProvider
} from "react-stripe-elements";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";

import {
  DISABLE_SUBMIT,
  CREATE_PAYMENT,
  SET_FORMATTED_PRICE,
  SUBMIT_PAYMENT,
  DISABLE_COUPON_BUTTON,
  APPLY_COUPON_CODE,
  SET_PERCENT_OFF,
  SET_COUPON,
  UPDATE_COUPON_CODE,
  SHOW_COUPON_FIELD,
  SET_CAN_MAKE_PAYMENT,
  SET_PAYMENT_REQUEST,
  INIT_CONTAINER,
  UPDATE_PAYMENT_REQUEST,
  SET_ORDER
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import {
  showError,
  showSuccess,
  hideError
} from "../../utils/showing-error";

const initialState = {
  disableSubmit: false,
  disableCouponButton: false,
  couponCode: "",
  enableCouponField: false,
  percentOff: null,
  coupon: null,
  canMakePayment: false,
  paymentRequest: null,
  formattedPrice: null,
  order: {}
};
const store = createContext(initialState);
const { Provider } = store;

const displayError = (message) => {
  showError(message, "pelcro-error-payment-create");
};

const displaySuccess = (message) => {
  showSuccess(message, "pelcro-success-payment-create");
};

const PaymentMethodContainerWithoutStripe = ({
  style,
  className,
  children,
  successMessage,
  stripe,
  type,
  subscriptionIdToRenew,
  plan,
  product,
  store,
  order = {},
  giftRecipient = null,
  couponCode,
  onSuccess = () => {},
  onFailure = () => {},
  onLoading = () => {},
  onDisplay = () => {}
}) => {
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
        currency: window.Pelcro.user.read().currency || "usd",
        total: {
          label: plan.nickname || plan.description,
          amount: state.formattedPrice || plan.amount
        }
      });

      paymentRequest.on("token", ({ complete, token, ...data }) => {
        dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        onLoading();
        subscribe(token, state, dispatch);
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

  const createPayment = (token, state, dispatch) => {
    dispatch({ type: DISABLE_SUBMIT, payload: true });
    window.Pelcro.source.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        token: token.id
      },
      (err, res) => {
        console.log("createPayment -> err, res", err, res);
        dispatch({ type: DISABLE_SUBMIT, payload: false });
        if (err) {
          console.log("createPayment -> err", err);
          onFailure(err);
          return displayError(getErrorMessages(err));
        }

        displaySuccess(successMessage);
        onSuccess(res);
      }
    );
  };

  const onApplyCouponCode = (state, dispatch) => {
    dispatch({ type: DISABLE_COUPON_BUTTON, payload: true });

    window.Pelcro.order.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: plan.id,
        coupon_code: state.couponCode
      },
      (err, res) => {
        dispatch({ type: DISABLE_COUPON_BUTTON, payload: false });

        if (err) {
          dispatch({ type: SET_PERCENT_OFF, payload: "" });
          onFailure(err);
          return showError(
            getErrorMessages(err),
            "pelcro-error-payment"
          );
        } else {
          hideError("pelcro-error-payment");
        }
        dispatch({
          type: SET_PERCENT_OFF,
          payload: "Discounted price: $" + res.data.total
        });

        dispatch({
          type: SET_FORMATTED_PRICE,
          payload: res.data.total
        });

        if (state.canMakePayment) {
          dispatch({ type: UPDATE_PAYMENT_REQUEST });
        }

        dispatch({ type: SET_COUPON, payload: res.data.coupon });
      }
    );
  };

  const subscribe = (token, state, dispatch) => {
    if (!subscriptionIdToRenew) {
      window.Pelcro.subscription.create(
        {
          stripe_token: token.id,
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: plan.id,
          coupon_code: couponCode,
          gift_recipient_email: giftRecipient
            ? giftRecipient.email
            : null,
          gift_recipient_first_name: giftRecipient?.firstName,
          gift_recipient_last_name: giftRecipient?.lastName,
          address_id: product.address_required
            ? window.Pelcro.user.read().addresses[
                window.Pelcro.user.read().addresses.length - 1
              ].id
            : null
        },
        (err, res) => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });

          if (err) {
            onFailure(err);
            return showError(
              getErrorMessages(err),
              "pelcro-error-payment"
            );
          }

          onSuccess(res);
        }
      );
    } else {
      window.Pelcro.subscription.renew(
        {
          stripe_token: token.id,
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: plan.id,
          coupon_code: couponCode,
          subscription_id: subscriptionIdToRenew,
          address_id: product.address_required
            ? window.Pelcro.user.read().addresses[
                window.Pelcro.user.read().addresses.length - 1
              ]
            : null
        },
        (err, res) => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });

          if (err) {
            onFailure(err);
            return displayError(getErrorMessages(err));
          }

          onSuccess(res);
        }
      );
    }

    // Prevent the form from being submitted:
    return false;
  };

  const purchase = (token, state, dispatch) => {
    const order = state.order;
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
        if (err) {
          onFailure(err);
          return showError(
            getErrorMessages(err),
            "pelcro-error-payment"
          );
        }

        onSuccess(res);
      }
    );
  };

  const updatePaymentRequest = (state) => {
    state.paymentRequest.update({
      total: {
        label: plan.nickname || plan.description,
        amount: state.formattedPrice
      }
    });
  };

  const submitPayment = (state, dispatch) => {
    return stripe.createToken().then(({ token, error }) => {
      if (error) {
        onFailure(error);
        showError(error?.message, "pelcro-error-payment-create");
        dispatch({ type: DISABLE_SUBMIT, payload: false });
      } else if (token && type === "createPayment") {
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        subscribe(token, state, dispatch);
      } else if (token && type === "orderCreate") {
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        purchase(token, state, dispatch);
      } else if (token) {
        createPayment(token, state, dispatch);
      }
    });
  };

  const [state, dispatch] = useReducerWithSideEffects(
    (state, action) => {
      switch (action.type) {
        case DISABLE_SUBMIT:
          return Update({ ...state, disableSubmit: action.payload });

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

        case CREATE_PAYMENT:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true },
            (state, dispatch) =>
              createPayment(action.payload, state, dispatch)
          );

        case INIT_CONTAINER:
          return UpdateWithSideEffect(state, (state, dispatch) =>
            initPaymentRequest(state, dispatch)
          );

        case UPDATE_PAYMENT_REQUEST:
          return UpdateWithSideEffect(state, (state, dispatch) =>
            updatePaymentRequest(state, dispatch)
          );

        case SUBMIT_PAYMENT:
          return UpdateWithSideEffect(
            { ...state, disableSubmit: true },
            (state, dispatch) => submitPayment(state, dispatch)
          );

        case SET_FORMATTED_PRICE:
          return Update({ ...state, formattedPrice: action.payload });

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

        case UPDATE_COUPON_CODE:
          return Update({ ...state, couponCode: action.payload });

        case SET_PERCENT_OFF:
          return Update({ ...state, percentOff: action.payload });

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
