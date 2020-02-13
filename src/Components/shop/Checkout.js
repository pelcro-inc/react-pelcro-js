// Checkout view.
// It is displayed after the products are selected (after Cart view) if user is authenticated.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";

import localisation from "../../utils/localisation";
import { showError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "../form/CheckoutForm";
import { getErrorMessages } from "../common/Helpers";

class Checkout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disableSubmit: false,
      order: this.props.order,
      products: this.props.products
    };

    this.locale = localisation("payment").getLocaleData();

    this.user = window.Pelcro.user.read();
    this.address = window.Pelcro.user.read().addresses
      ? window.Pelcro.user.read().addresses[
          window.Pelcro.user.read().addresses.length - 1
        ]
      : null;

    this.site = window.Pelcro.site.read();

    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.subscribe = this.subscribe.bind(this);
    this.setDisableSubmitState = this.setDisableSubmitState.bind(
      this
    );
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "payment"
    });

    this.setState({ couponCode: window.Pelcro.coupon.getFromUrl() });
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-payment");
  };

  setDisableSubmitState = state => {
    this.setState({ disableSubmit: state });
  };

  subscribe = token => {
    const { order } = this.props;
    order.email = this.user.email;

    order.shipping = {
      name: `${this.address.first_name} ${this.address.last_name}`,
      address: {
        line1: this.address.line1,
        line2: this.address.line2,
        city: this.address.city,
        state: this.address.state,
        country: this.address.country,
        postal_code: this.address.postal_code
      }
    };

    window.Pelcro.checkout.purchase(
      {
        order: order,
        source: token.id,
        auth_token: window.Pelcro.user.read().auth_token
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) return this.showError(getErrorMessages(err));

        this.props.setView("confirm");
      }
    );
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div
          className="pelcro-prefix-modal modal pelcro-prefix-fade pelcro-prefix-show"
          id="pelcro-view-checkout"
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
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.site}
              ></Header>

              <div className="pelcro-prefix-modal-body">
                <div className="pelcro-prefix-title-block">
                  <h4>{this.locale.labels.checkout.title}</h4>
                </div>

                <ErrMessage name="payment" />

                <div className="pelcro-prefix-payment-block">
                  <div className="pelcro-prefix-alert pelcro-prefix-alert-success">
                    <div className="pelcro-prefix-payment-message">
                      <span>
                        {this.locale.messages.youAreSafe}{" "}
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
                          callback={this.subscribe}
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

Checkout.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  giftRecipient: PropTypes.object,
  setView: PropTypes.func,
  resetView: PropTypes.func,
  logout: PropTypes.func,
  subscriptionIdToRenew: PropTypes.number
};

export default Checkout;
