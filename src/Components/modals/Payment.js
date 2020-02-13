// Payment view.
// It is displayed after the plan is selected (after Select view) if user is authenticated.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";
import { getErrorMessages } from "../common/Helpers";

import localisation from "../../utils/localisation";
import { showError, hideError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "../form/CheckoutForm";
import { formatDiscountedPrice } from "../../utils/utils";

class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      enableCouponField: false,
      disableSubmit: false,
      couponCode: "",
      percentOff: "",
      coupon: null,
      disableCouponButton: false
    };

    this.locale = localisation("payment").getLocaleData();

    this.plan = this.props.plan;
    this.product = this.props.product;

    this.site = window.Pelcro.site.read();
    this.closeButton = window.Pelcro.paywall.displayCloseButton();

    this.subscribe = this.subscribe.bind(this);
    this.setDisableSubmitState = this.setDisableSubmitState.bind(
      this
    );
    this.showCouponField = this.showCouponField.bind(this);
    this.onCouponCodeChange = this.onCouponCodeChange.bind(this);
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "payment"
    });

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Payment Modal Viewed",
      nonInteraction: true
    });

    if (window.Pelcro.coupon.getFromUrl()) {
      this.setState(
        { couponCode: window.Pelcro.coupon.getFromUrl() },
        () => {
          this.showCouponField();
          this.onApplyCouponCode();
        }
      );
    }
  };

  // inserting error message into modal window
  showError = message => {
    showError(message, "pelcro-error-payment");
  };

  showCouponField = () => {
    this.setState({
      enableCouponField: !this.state.enableCouponField
    });
  };

  setDisableSubmitState = state => {
    this.setState({ disableSubmit: state });
  };

  subscribe = token => {
    if (!this.props.subscriptionIdToRenew) {
      window.Pelcro.subscription.create(
        {
          stripe_token: token.id,
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: this.plan.id,
          coupon_code: this.state.couponCode,
          gift_recipient_email: this.props.giftRecipient
            ? this.props.giftRecipient.email
            : null,
          address_id: this.product.address_required
            ? window.Pelcro.user.read().addresses[
                window.Pelcro.user.read().addresses.length - 1
              ].id
            : null
        },
        (err, res) => {
          this.setState({ disableSubmit: false });

          if (err) return this.showError(getErrorMessages(err));

          this.props.ReactGA.event({
            category: "ACTIONS",
            action: "Subscribed",
            nonInteraction: true
          });

          if (this.props.giftRecipient) {
            window.alert(
              `${this.locale.messages.giftSent} ${this.props.giftRecipient.email} ${this.locale.messages.successfully}`
            );
            this.props.resetView();
          } else {
            this.props.setView("success");
          }
        }
      );
    } else {
      window.Pelcro.subscription.renew(
        {
          stripe_token: token.id,
          auth_token: window.Pelcro.user.read().auth_token,
          plan_id: this.plan.id,
          coupon_code: this.state.couponCode,
          subscription_id: this.props.subscriptionIdToRenew,
          address_id: this.product.address_required
            ? window.Pelcro.user.read().addresses[
                window.Pelcro.user.read().addresses.length - 1
              ]
            : null
        },
        (err, res) => {
          this.setState({ disableSubmit: false });

          if (err) return this.showError(getErrorMessages(err));

          this.props.ReactGA.event({
            category: "ACTIONS",
            action: "Reactivated",
            nonInteraction: true
          });

          if (this.props.giftRecipient) {
            this.props.resetView();
            window.alert(
              `${this.locale.messages.giftSent} ${this.props.giftRecipient.email} ${this.locale.messages.successfully}`
            );
          } else {
            this.props.setView("success");
          }
        }
      );
    }

    // Prevent the form from being submitted:
    return false;
  };

  getMonthsOptions = () => {
    let value = 0;
    const monthOptions = [];
    for (const month in this.locale.labels.months) {
      monthOptions.push(
        <option value={++value} key={"month-option-" + value}>
          {this.locale.labels.months[month]}
        </option>
      );
    }
    return monthOptions;
  };

  getYearsOptions = () => {
    const thisYear = new Date().getFullYear();
    const yearOptions = [];
    for (let year = thisYear; year <= thisYear + 12; year++) {
      yearOptions.push(
        <option value={year + ""} key={"year-option-" + year}>
          {year}
        </option>
      );
    }
    return yearOptions;
  };

  onCouponCodeChange(event) {
    this.setState({ couponCode: event.target.value });
  }

  onApplyCouponCode = () => {
    this.setState({ disableSubmit: true, disableCouponButton: true });

    window.Pelcro.order.create(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        plan_id: this.plan.id,
        coupon_code: this.state.couponCode
      },
      (err, res) => {
        this.setState({
          disableSubmit: false,
          disableCouponButton: false
        });

        if (err) {
          this.setState({ percentOff: "" });
          return this.showError(getErrorMessages(err));
        } else {
          hideError("pelcro-error-payment");
        }
        // @FIXME: remove manually entered $ sign
        this.setState({
          percentOff:
            "Discounted price: $" +
            formatDiscountedPrice(
              this.plan.amount,
              res.data.coupon.percent_off
            ),
          coupon: res.data.coupon
        });
      }
    );
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
                closeButton={this.closeButton}
                resetView={this.props.resetView}
                site={this.site}
              ></Header>

              <div className="pelcro-prefix-modal-body">
                <div className="pelcro-prefix-title-block">
                  <h4>{this.product.paywall.subscribe_title}</h4>
                  <p>
                    {this.product.paywall.subscribe_subtitle} -{" "}
                    {this.plan.amount_formatted}
                    {this.plan.auto_renew && (
                      <span>/({this.plan.interval_count})</span>
                    )}{" "}
                    {this.plan.interval}. {this.state.percentOff}
                  </p>
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
                          disableCouponButton={
                            this.state.disableCouponButton
                          }
                          showError={this.showError}
                          setDisableSubmitState={
                            this.setDisableSubmitState
                          }
                          enableCouponField={
                            this.state.enableCouponField
                          }
                          showCouponField={this.showCouponField}
                          couponCode={this.state.couponCode}
                          onCouponCodeChange={this.onCouponCodeChange}
                          onApplyCouponCode={this.onApplyCouponCode}
                          plan={this.props.plan}
                          coupon={this.state.coupon}
                        />
                      </Elements>
                    </StripeProvider>
                  </div>
                </div>
              </div>
              <div className="pelcro-prefix-modal-footer">
                <small>
                  {this.locale.messages.haveQuestion}{" "}
                  {this.locale.messages.visitOurFaq.visitOur}{" "}
                  <a
                    className="pelcro-prefix-link"
                    target="new"
                    href="https://www.pelcro.com/faq/user"
                  >
                    {this.locale.messages.visitOurFaq.faq}
                  </a>
                  . {this.locale.messages.cancel}
                  {" " + this.locale.messages.logout.logout}{" "}
                  <button
                    className="pelcro-prefix-link"
                    onClick={this.props.logout}
                  >
                    {this.locale.messages.logout.here}
                  </button>
                </small>
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Payment.propTypes = {
  plan: PropTypes.object,
  product: PropTypes.object,
  giftRecipient: PropTypes.object,
  setView: PropTypes.func,
  resetView: PropTypes.func,
  logout: PropTypes.func,
  subscriptionIdToRenew: PropTypes.number
};

export default Payment;
