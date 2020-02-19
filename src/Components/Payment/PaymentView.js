import React, { Component } from "react";
import PropTypes from "prop-types";
import { Elements, StripeProvider } from "react-stripe-elements";
import { withTranslation } from "react-i18next";

import ErrMessage from "../common/ErrMessage";
import AlertSuccess from "../common/AlertSuccess";
import { getErrorMessages } from "../common/Helpers";
import { showError, showSuccess } from "../../utils/showing-error";

import CheckoutForm from "../form/CheckoutForm";
import styles from "./styles.module.scss";

class DefaultPaymentView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false
    };

    this.site = window.Pelcro.site.read();

    this.create = this.create.bind(this);
    this.setDisableSubmitState = this.setDisableSubmitState.bind(this);
  }

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-payment-create");
  };

  showSuccess = message => {
    showSuccess(message, "pelcro-success-payment-create");
  };

  setDisableSubmitState = state => {
    this.setState({ disableSubmit: state });
  };

  create = token => {
    // Token was created!
    window.Pelcro.source.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        token: token.id
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));

        this.props.ReactGA.event({
          category: "ACTIONS",
          action: "Updated Payment",
          nonInteraction: true
        });

        this.showSuccess(this.props.t("success"));
      }
    );

    // Prevent the form from being submitted:
    return false;
  };

  render() {
    const { t } = this.props;

    return (
      <React.Fragment>
        <div className="pelcro-prefix-title-block">
          <h4>{t("title")}</h4>
          <p>{t("subtitle")}</p>
        </div>

        <ErrMessage name="payment-create" />
        <AlertSuccess name="payment-create" />

        <div
          className={`${styles["pelcro-prefix-payment-block"]} pelcro-prefix-payment-block`}
        >
          <div className="pelcro-prefix-alert pelcro-prefix-alert-success">
            <div className="pelcro-prefix-payment-message">
              <span>
                {t("secure")}{" "}
                <a
                  className="pelcro-prefix-link"
                  rel="nofollow"
                  target="new"
                  href="https://www.stripe.com/us/customers"
                >
                  Stripe
                </a>{" "}
              </span>
            </div>
          </div>

          <div className="pelcro-prefix-form">
            <StripeProvider
              apiKey={window.Pelcro.environment.stripe}
              stripeAccount={this.site.account_id}
            >
              <Elements>
                <CheckoutForm
                  callback={this.create}
                  disableSubmit={this.state.disableSubmit}
                  showError={this.showError}
                  setDisableSubmitState={this.setDisableSubmitState}
                />
              </Elements>
            </StripeProvider>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

DefaultPaymentView.propTypes = {
  setView: PropTypes.func,
  resetView: PropTypes.func
};

export const PaymentView = withTranslation("paymentCreate")(DefaultPaymentView);
