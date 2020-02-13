// Payment view.
// It is displayed after the plan is selected (after Select view) if user is authenticated.

import React, { Component } from "react";
import ErrMessage from "../../common/ErrMessage";
import AlertSuccess from "../../common/AlertSuccess";
import PropTypes from "prop-types";
import { getErrorMessages } from "../../common/Helpers";

import localisation from "../../../utils/localisation";
import {
  showError,
  showSuccess
} from "../../../utils/showing-error";

import Header from "../../common/Header";
import Authorship from "../../common/Authorship";

import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "../../form/CheckoutForm";

class SourceCreate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false
    };

    this.locale = localisation("payment-create").getLocaleData();

    this.site = window.Pelcro.site.read();

    this.create = this.create.bind(this);
    this.setDisableSubmitState = this.setDisableSubmitState.bind(
      this
    );
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

        this.showSuccess(this.locale.success);
      }
    );

    // Prevent the form from being submitted:
    return false;
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-payment"
          tabIndex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div
            className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
            role="document"
          >
            <div className="pelcro-prefix-modal-content">
              <Header
                closeButton={true}
                resetView={this.props.resetView}
                site={this.site}
              ></Header>

              <div className="pelcro-prefix-modal-body">
                <div className="pelcro-prefix-title-block">
                  <h4>{this.locale.title}</h4>
                  <p>{this.locale.subtitle}</p>
                </div>

                <ErrMessage name="payment-create" />
                <AlertSuccess name="payment-create" />

                <div className="pelcro-prefix-payment-block">
                  <div className="pelcro-prefix-alert pelcro-prefix-alert-success">
                    <div className="pelcro-prefix-payment-message">
                      <span>
                        {this.locale.secure}{" "}
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
                          setDisableSubmitState={
                            this.setDisableSubmitState
                          }
                        />
                      </Elements>
                    </StripeProvider>
                  </div>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SourceCreate.propTypes = {
  setView: PropTypes.func,
  resetView: PropTypes.func
};

export default SourceCreate;
