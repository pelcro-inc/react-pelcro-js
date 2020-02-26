import React, { createContext, useReducer } from "react";
import {
  DISABLE_SUBMIT,
  CREATE_PAYMENT,
  SUBMIT_PAYMENT
} from "../../utils/action-types";
import { getErrorMessages } from "../common/Helpers";
import { showError, showSuccess } from "../../utils/showing-error";

const initialState = {
  disableSubmit: false
};
const store = createContext(initialState);
const { Provider } = store;

const displayError = message => {
  showError(message, "pelcro-error-payment-create");
};

const displaySuccess = message => {
  showSuccess(message, "pelcro-success-payment-create");
};

const CheckoutFormContainer = ({
  style,
  className,
  children,
  ReactGA,
  successMessage
}) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case DISABLE_SUBMIT:
        return { ...state, disableSubmit: action.payload };

      case CREATE_PAYMENT:
        window.Pelcro.source.create(
          {
            auth_token: window.Pelcro.user.read().auth_token,
            token: action.payload.id
          },
          err => {
            if (err) return displayError(getErrorMessages(err));

            ReactGA.event({
              category: "ACTIONS",
              action: "Updated Payment",
              nonInteraction: true
            });

            displaySuccess(successMessage);
            return { ...state, disableSubmit: false };
          }
        );
        return { ...state, disableSubmit: true };

      case SUBMIT_PAYMENT:
        this.props.setDisableSubmitState(true);

        this.props.stripe.createToken().then(({ token, error }) => {
          if (error) {
            this.props.showError(error.message);
            this.props.setDisableSubmitState(false);
          } else if (token) {
            this.props.callback(token);
          }
        });
        return state;

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

export { CheckoutFormContainer, store };
