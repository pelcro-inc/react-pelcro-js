import React, { createContext, useReducer } from "react";
import { injectStripe, Elements, StripeProvider } from "react-stripe-elements";
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
  stripe
}) => {
  const createPayment = token => {
    dispatch({ type: DISABLE_SUBMIT, payload: true });
    window.Pelcro.source.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        token: token.id
      },
      err => {
        dispatch({ type: DISABLE_SUBMIT, payload: false });
        console.log("err is: ", err);
        if (err) return displayError(getErrorMessages(err));

        displaySuccess(successMessage);
      }
    );
  };

  const submitPayment = () => {
    stripe.createToken().then(({ token, error }) => {
      dispatch({ type: DISABLE_SUBMIT, payload: false });
      if (error) {
        showError(error.message);
      } else if (token) {
        createPayment(token);
      }
    });
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case DISABLE_SUBMIT:
        return { ...state, disableSubmit: action.payload };

      case CREATE_PAYMENT:
        createPayment(action.payload);
        return { ...state, disableSubmit: true };

      case SUBMIT_PAYMENT:
        submitPayment();
        return { ...state, disableSubmit: true };

      default:
        throw new Error();
    }
  }, initialState);

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
