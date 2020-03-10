import React, { createContext, useReducer, useMemo, useEffect } from "react";
import { injectStripe, Elements, StripeProvider } from "react-stripe-elements";
import useReducerWithSideEffects, {
  UpdateWithSideEffect,
  Update
} from "use-reducer-with-side-effects";

import {
  DISABLE_SUBMIT,
  CREATE_PAYMENT,
  SUBMIT_PAYMENT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError, showSuccess } from "../../utils/showing-error";

const initialState = {
  disableSubmit: false,
  disableCouponButton: false
};
const store = createContext(initialState);
const { Provider } = store;

const displayError = message => {
  showError(message, "pelcro-error-payment-create");
};

const displaySuccess = message => {
  console.log("will show success message: ", message);
  showSuccess(message, "pelcro-success-payment-create");
};

const CheckoutFormContainerWithoutStripe = ({
  style,
  className,
  children,
  successMessage,
  stripe,
  type,
  subscriptionIdToRenew,
  plan,
  product,
  giftRecipient,
  couponCode,
  ReactGA,
  setView,
  resetView
}) => {
  useEffect(() => {
    console.log("checkoutFormContainer got mounted");
  }, []);

  const createPayment = (token, state, dispatch) => {
    dispatch({ type: DISABLE_SUBMIT, payload: true });
    window.Pelcro.source.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        token: token.id
      },
      err => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });
        if (err) return displayError(getErrorMessages(err));

        displaySuccess(successMessage);
      }
    );
  };

  const subscribe = (token, state, dispatch) => {
    console.log("subscribe to plan");
    if (!subscriptionIdToRenew) {
      window.Pelcro.subscription.create(
        {
          stripe_token: token.id,
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: plan.id,
          coupon_code: couponCode,
          gift_recipient_email: giftRecipient ? giftRecipient.email : null,
          address_id: product.address_required
            ? window.Pelcro.user.read().addresses[
                window.Pelcro.user.read().addresses.length - 1
              ].id
            : null
        },
        (err, res) => {
          dispatch({ type: DISABLE_SUBMIT, payload: false });

          if (err) return showError(err.message, "pelcro-error-payment-create");

          // ReactGA.event({
          //   category: "ACTIONS",
          //   action: "Subscribed",
          //   nonInteraction: true
          // });

          if (giftRecipient) {
            window.alert(
              `${this.locale.messages.giftSent} ${giftRecipient.email} ${this.locale.messages.successfully}`
            );
            resetView();
          } else {
            setView("success");
            console.log("subscribe -> success");
          }
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

          if (err) return displayError(getErrorMessages(err));

          // ReactGA.event({
          //   category: "ACTIONS",
          //   action: "Reactivated",
          //   nonInteraction: true
          // });

          if (giftRecipient) {
            resetView();
            window.alert(
              `${this.locale.messages.giftSent} ${giftRecipient.email} ${this.locale.messages.successfully}`
            );
          } else {
            setView("success");
            console.log("subscribe renew -> success");
          }
        }
      );
    }

    // Prevent the form from being submitted:
    return false;
  };

  const submitPayment = (state, dispatch) => {
    console.log("submit payment!!");
    return stripe.createToken().then(({ token, error }) => {
      if (error) {
        showError(error.message, "pelcro-error-payment-create");
        dispatch({ type: DISABLE_SUBMIT, payload: false });
      } else if (token && type === "createPayment") {
        dispatch({ type: DISABLE_SUBMIT, payload: true });
        subscribe(token, state, dispatch);
      } else if (token) {
        createPayment(token, state, dispatch);
      }
    });
  };

  const [state, dispatch] = useReducerWithSideEffects((state, action) => {
    console.log("state, action", state, action);
    switch (action.type) {
      case DISABLE_SUBMIT:
        return Update({ ...state, disableSubmit: action.payload });

      case CREATE_PAYMENT:
        return UpdateWithSideEffect(
          { ...state, disableSubmit: true },
          (state, dispatch) => createPayment(action.payload, state, dispatch)
        );

      case SUBMIT_PAYMENT:
        console.log("SUBMIT_PAYMENT");
        return UpdateWithSideEffect(
          { ...state, disableSubmit: true },
          (state, dispatch) => submitPayment(state, dispatch)
        );

      default:
        throw new Error();
    }
  }, initialState);

  return useMemo(
    () => (
      <div style={{ ...style }} className={className}>
        <Provider value={{ state, dispatch }}>
          {children.length
            ? children.map((child, i) =>
                React.cloneElement(child, { store, key: i })
              )
            : React.cloneElement(children, { store })}
        </Provider>
      </div>
    ),
    [style, className, children]
  );
};

const UnwrappedForm = injectStripe(CheckoutFormContainerWithoutStripe);

const CheckoutFormContainer = props => {
  if (window.Stripe) {
    return (
      <StripeProvider
        apiKey={window.Pelcro.environment.stripe}
        stripeAccount={window.Pelcro.site.read().account_id}
      >
        <Elements>
          <UnwrappedForm {...props} />
        </Elements>
      </StripeProvider>
    );
  }
  return null;
};

export { CheckoutFormContainer, store };
