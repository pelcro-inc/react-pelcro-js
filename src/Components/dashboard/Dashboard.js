// Dashboard view.
// Displays dashboard shown after clicking on menu button. Contains user email,
// list of subscriptions, Logout button and Support link.
// Here user can unsubscribe from the plan he is subscribed on.

import React, { Component } from "react";
import ErrMessage from "../common/ErrMessage";
import PropTypes from "prop-types";
import { showError } from "../../utils/showing-error";
import { getErrorMessages } from "../common/Helpers";
import { withTranslation } from "react-i18next";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subscriptions: window.Pelcro.subscription.list(),
      giftRecipients:
        window.Pelcro.user.read()?.gift_recipients ?? [],
      disableSubmit: false,
      enableGiftCodeField: false,
      gift_code: "",
      addresses: []
    };

    this.site = window.Pelcro.site.read();
    this.locale = this.props.t;
    this.user = window.Pelcro.user.read();
    this.address = window.Pelcro.user.read().addresses
      ? window.Pelcro.user.read().addresses[
          window.Pelcro.user.read().addresses.length - 1
        ]
      : null;

    this.cancelSubscription = this.cancelSubscription.bind(this);
    this.reactivateSubscription = this.reactivateSubscription.bind(
      this
    );
    this.getSubsctiptions = this.getSubsctiptions.bind(this);
    this.onSubmitGiftCode = this.onSubmitGiftCode.bind(this);
  }

  componentDidMount = () => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "dashboard"
    });

    this.props.ReactGA.event({
      category: "VIEWS",
      action: "Dashboard Modal Viewed",
      nonInteraction: true
    });

    const { addresses } = window.Pelcro.user.read();
    if (addresses) this.setState({ addresses: addresses });
  };

  // inserting error message into modal window
  showError = (message) => {
    showError(message, "pelcro-error-dashboard");
  };

  cancelSubscription = (subscription_id) => {
    // disable the Login button to prevent repeated clicks
    this.setState({ disableSubmit: true });

    window.Pelcro.subscription.cancel(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) {
          return this.showError(getErrorMessages(err));
        }

        this.props.ReactGA.event({
          category: "ACTIONS",
          action: "Canceled",
          nonInteraction: true
        });

        this.props.resetView();
      }
    );
  };

  onSubmitGiftCode = () => {
    return this.props.setView("redeem");
  };

  displaySourceCreate = () => {
    return this.props.setView("source-create");
  };

  displayUserEdit = () => {
    return this.props.setView("user-edit");
  };

  displayAddressEdit = (e) => {
    const address = e.target.dataset.key;
    this.props.setAddress(address);

    return this.props.setView("address-edit");
  };

  getGiftRecipientStatusText = (recipient) => {
    if (recipient.status === "canceled") {
      const cancelDate = new Date(recipient.canceled_at);
      const formattedCancelDate = new Intl.DateTimeFormat(
        "en-CA"
      ).format(cancelDate);

      return `${this.locale(
        "labels.canceledOn"
      )} ${formattedCancelDate}`;
    }

    if (recipient.cancel_at_period_end) {
      return `${this.locale("labels.expiresOn")} ${
        recipient.current_period_end
      }`;
    }

    return `${this.locale("labels.renewsOn")} ${
      recipient.current_period_end
    }`;
  };

  reactivateSubscription = (subscription_id) => {
    // disable the Login button to prevent repeated clicks
    this.setState({ disableSubmit: true });

    window.Pelcro.subscription.reactivate(
      {
        auth_token: window.Pelcro.user.read().auth_token,
        subscription_id: subscription_id
      },
      (err, res) => {
        this.setState({ disableSubmit: false });

        if (err) {
          return this.showError(getErrorMessages(err));
        }

        this.props.resetView();
      }
    );
  };

  getSubsctiptions = () => {
    const subscriptions =
      this.state.subscriptions &&
      this.state.subscriptions.map((sub) => {
        // Cancel button click handlers
        const onCancelClick = () => {
          const confirmation = window.confirm(
            this.locale("labels.isSureToCancel")
          );

          if (confirmation === true) {
            this.cancelSubscription(sub.id);
          }
        };

        // Reactivate button click handlers
        const onReactivateClick = () => {
          this.reactivateSubscription(sub.id);
        };

        // Renew click
        const onRenewClick = () => {
          const product_id = sub.plan.product.id;
          const plan_id = sub.plan.id;

          const product = window.Pelcro.product.getById(product_id);
          const plan = window.Pelcro.plan.getById(plan_id);

          this.props.setProductAndPlan(product, plan);
          this.props.setSubscriptionIdToRenew(sub.id);
          this.props.setView("select");
        };

        const status = sub.cancel_at_period_end
          ? `${this.locale("labels.expiresOn")} ${
              sub.current_period_end
            }`
          : `${this.locale("labels.renewsOn")} ${
              sub.current_period_end
            }`;

        return (
          <div
            key={"dashboard-subscription-" + sub.id}
            className="pelcro-prefix-dashboard-block__item"
          >
            <div>
              {sub.plan.nickname && (
                <div className="pelcro-prefix-dashboard-text row">
                  <span className="pelcro-prefix-dashboard-label col-4">
                    {this.locale("labels.plan")}
                  </span>
                  <span className="pelcro-prefix-dashboard-value col-8">
                    {sub.plan.nickname}
                  </span>
                </div>
              )}
            </div>
            <div>
              {sub.status && (
                <div className="pelcro-prefix-dashboard-text row">
                  <span className="pelcro-prefix-dashboard-label col-4">
                    {this.locale("labels.status")}
                  </span>
                  <span className="pelcro-prefix-dashboard-value col-8">
                    {status}
                  </span>
                </div>
              )}
            </div>
            <div>
              {sub.shipments_remaining && (
                <div className="pelcro-prefix-dashboard-text row">
                  <span className="pelcro-prefix-dashboard-label col-4">
                    {this.locale("labels.shipments")}
                  </span>
                  <span className="pelcro-prefix-dashboard-value col-8">
                    {sub.shipments_remaining}
                  </span>
                </div>
              )}
            </div>
            <div>
              <div className="pelcro-prefix-dashboard-text row">
                <span className="pelcro-prefix-dashboard-label col-4">
                  {this.locale("labels.actions")}
                </span>
                <div className="col-8">
                  {sub.cancel_at_period_end === 0 && (
                    <button
                      className="pelcro-prefix-link pelcro-prefix-unsubscribe-btn"
                      type="button"
                      onClick={onCancelClick}
                      disabled={this.state.disableSubmit}
                    >
                      {this.locale("labels.unsubscribe")}
                    </button>
                  )}
                  {sub.cancel_at_period_end === 1 &&
                    sub.plan.auto_renew && (
                      <button
                        className="pelcro-prefix-link pelcro-prefix-reactivate-btn"
                        type="button"
                        onClick={onReactivateClick}
                        disabled={this.state.disableSubmit}
                      >
                        {this.locale("labels.reactivate")}
                      </button>
                    )}
                  {sub.cancel_at_period_end === 1 && (
                    <button
                      className="pelcro-prefix-link pelcro-prefix-renew-btn"
                      type="button"
                      onClick={onRenewClick}
                      disabled={this.state.disableSubmit}
                    >
                      {this.locale("labels.renew")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      });
    return subscriptions;
  };

  renderGiftRecipients = () => {
    const { giftRecipients } = this.state;

    return giftRecipients.map((recipient) => {
      // Renew click
      const onRenewClick = () => {
        const productId = recipient.plan?.product?.id;
        const planId = recipient.plan?.id;
        const product = window.Pelcro.product.getById(productId);
        const plan = window.Pelcro.plan.getById(planId);
        this.props.setProductAndPlan(product, plan);
        this.props.setSubscriptionIdToRenew(recipient.id);
        this.props.setIsRenewingGift(true);
        this.props.setView("select");
      };

      return (
        <div
          key={"dashboard-gift-recipients-" + recipient.id}
          className="pelcro-prefix-dashboard-block__item"
        >
          {/* User info section */}
          {(recipient.first_name || recipient.last_name) && (
            <div>
              <div className="pelcro-prefix-dashboard-text row">
                <span className="pelcro-prefix-dashboard-label col-4">
                  {this.locale("labels.name")}
                </span>
                <span className="pelcro-prefix-dashboard-value col-8">
                  {recipient.first_name} {recipient.last_name}
                </span>
              </div>
            </div>
          )}
          <div>
            <div className="pelcro-prefix-dashboard-text row">
              <span className="pelcro-prefix-dashboard-label col-4">
                {this.locale("labels.email")}
              </span>
              <span className="pelcro-prefix-dashboard-value col-8">
                {recipient.email}
              </span>
            </div>
          </div>

          {/* Plan info section */}
          <div>
            {recipient.plan.nickname && (
              <div className="pelcro-prefix-dashboard-text row">
                <span className="pelcro-prefix-dashboard-label col-4">
                  {this.locale("labels.plan")}
                </span>
                <span className="pelcro-prefix-dashboard-value col-8">
                  {recipient.plan.nickname}
                </span>
              </div>
            )}
          </div>

          {/* Subscription status section */}
          <div>
            {recipient.status && (
              <div className="pelcro-prefix-dashboard-text row">
                <span className="pelcro-prefix-dashboard-label col-4">
                  {this.locale("labels.status")}
                </span>
                <span className="pelcro-prefix-dashboard-value col-8">
                  {this.getGiftRecipientStatusText(recipient)}
                </span>
              </div>
            )}
          </div>

          {/* shipments section */}
          <div>
            {recipient.shipments_remaining && (
              <div className="pelcro-prefix-dashboard-text row">
                <span className="pelcro-prefix-dashboard-label col-4">
                  {this.locale("labels.shipments")}
                </span>
                <span className="pelcro-prefix-dashboard-value col-8">
                  {recipient.shipments_remaining}
                </span>
              </div>
            )}
          </div>

          {/* Recipient sub renew section */}
          {recipient.cancel_at_period_end === 1 && (
            <div className="pelcro-prefix-dashboard-text row">
              <span className="pelcro-prefix-dashboard-label col-4">
                {this.locale("labels.actions")}
              </span>
              <div className="col-8">
                <button
                  className="pelcro-prefix-link pelcro-prefix-renew-btn"
                  type="button"
                  onClick={onRenewClick}
                  disabled={this.state.disableSubmit}
                >
                  {this.locale("labels.renew")}
                </button>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  getAddresses = () => {
    const addresses =
      this.state.addresses &&
      this.state.addresses.map((address, index) => {
        return (
          <div key={"dashboard-address-" + address.id}>
            <span className="pelcro-prefix-dashboard-value">
              {address.line1} {address.line2}, {address.city},{" "}
              {address.state}, {address.country}
            </span>
            <div className="pelcro-prefix-dashboard-value">
              <button
                id={"pelcro-button-update-address-" + index}
                data-key={address.id}
                className="pelcro-prefix-link"
                type="button"
                onClick={this.displayAddressEdit}
              >
                {" "}
                {this.locale("labels.updateAddress")}
              </button>
            </div>
          </div>
        );
      });
    return addresses;
  };

  render() {
    return (
      <div className="pelcro-prefix-view">
        <div id="pelcro-view-dashboard">
          <button
            type="button"
            className="pelcro-prefix-dashboard-close pelcro-prefix-close"
            aria-label="Close"
            onClick={this.props.resetView}
          >
            <span>&times;</span>
          </button>
          <div className="pelcro-prefix-dashboard-block logo">
            {this.site.logo && (
              <img
                alt="avatar"
                className="pelcro-prefix-site-logo pelcro-prefix-center"
                src={this.site.logo.url}
              />
            )}
          </div>

          <div className="dashboard-content">
            <ErrMessage name="dashboard" />

            <div className="border-block">
              <div className="subscriptions-header border-text">
                <h4> {this.locale("labels.account")}</h4>
              </div>

              <div className="pelcro-prefix-dashboard-block">
                {(this.user.first_name || this.user.last_name) && (
                  <div className="pelcro-prefix-dashboard-text row">
                    <span className="pelcro-prefix-dashboard-label col-4">
                      {this.locale("labels.name")}
                    </span>
                    <span className="pelcro-prefix-dashboard-value col-8">
                      {this.user.first_name} {this.user.last_name}
                    </span>
                  </div>
                )}

                {this.user.email && (
                  <div className="pelcro-prefix-dashboard-text row">
                    <span className="pelcro-prefix-dashboard-label col-4">
                      {this.locale("labels.email")}
                    </span>
                    <div className="pelcro-prefix-dashboard-value col-8">
                      <span className="dashboard-email">
                        {this.user.email}
                      </span>
                      <div className="pelcro-prefix-dashboard-link">
                        <button
                          className="pelcro-prefix-link"
                          id="pelcro-button-update-email"
                          type="button"
                          onClick={this.displayUserEdit}
                        >
                          {" "}
                          {this.locale("labels.updateProfile")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {this.user.addresses && (
                  <div className="pelcro-prefix-dashboard-text row">
                    <span className="pelcro-prefix-dashboard-label col-4">
                      {this.locale("labels.address")}
                    </span>
                    <span className="col-8">
                      {this.getAddresses()}
                    </span>
                  </div>
                )}

                {this.user.source && (
                  <div className="pelcro-prefix-dashboard-text row">
                    <span className="pelcro-prefix-dashboard-label col-4">
                      {this.locale("labels.paymentSource")}
                    </span>
                    <div className="pelcro-prefix-dashboard-value col-8">
                      <span className="dashboard-email">
                        {this.user.source.properties.last4} -{" "}
                        {this.user.source.properties.brand}
                      </span>
                      <div className="pelcro-prefix-dashboard-link">
                        <button
                          className="pelcro-prefix-link"
                          id="pelcro-button-update-payment"
                          type="button"
                          onClick={this.displaySourceCreate}
                        >
                          {" "}
                          {this.locale("labels.updatePaymentSource")}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-block">
              <div className="subscriptions-header border-text">
                <h4>{this.locale("labels.subscriptions")}</h4>
              </div>
              <div className="pelcro-prefix-dashboard-block">
                {this.getSubsctiptions()}
                <div className="pelcro-prefix-dashboard-text">
                  <div className="redeem-gift">
                    <button
                      className="pelcro-prefix-link"
                      id="pelcro-button-redeem-gift"
                      type="button"
                      onClick={this.onSubmitGiftCode}
                    >
                      {this.locale("labels.redeemGift")}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {Boolean(this.state.giftRecipients.length) && (
              <div className="border-block">
                <div className="border-text">
                  <h4>
                    {this.locale("labels.giftRecipients.title")}
                  </h4>
                </div>
                <div className="pelcro-prefix-dashboard-block">
                  {this.renderGiftRecipients()}
                </div>
              </div>
            )}

            <button
              name="logout"
              className="pelcro-prefix-btn pelcro-prefix-logout-btn"
              onClick={this.props.logout}
              disabled={this.state.disableSubmit}
            >
              {this.locale("labels.logout")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  resetView: PropTypes.func,
  setView: PropTypes.func,
  logout: PropTypes.func,
  setProductAndPlan: PropTypes.func,
  setSubscriptionIdToRenew: PropTypes.func,
  setAddress: PropTypes.func,
  setIsRenewingGift: PropTypes.func
};

export const DashboardWithTrans = withTranslation("dashboard")(
  Dashboard
);
