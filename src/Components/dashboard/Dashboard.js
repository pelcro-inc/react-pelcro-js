import React, { Component } from "react";
import { Transition } from "@headlessui/react";
import { getErrorMessages } from "../common/Helpers";
import { withTranslation } from "react-i18next";
import { getFormattedPriceByLocal } from "../../utils/utils";
import { Button } from "../../SubComponents/Button";
import { getPaymentCardIcon } from "./utils";
import { Accordion } from "./Accordion";
import { ReactComponent as ExitIcon } from "../../assets/exit.svg";
import { ReactComponent as ArrowLeftIcon } from "../../assets/arrow-left.svg";
import { ReactComponent as CheckMarkIcon } from "../../assets/check-mark.svg";
import { ReactComponent as ExclamationIcon } from "../../assets/exclamation.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as SettingsIcon } from "../../assets/settings.svg";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";
import { ReactComponent as XCircleIcon } from "../../assets/x-icon-circle.svg";
import { ReactComponent as PaymentCardIcon } from "../../assets/payment-card.svg";
import { ReactComponent as LocationIcon } from "../../assets/location-pin.svg";
import { ReactComponent as BoxIcon } from "../../assets/box.svg";
import { ReactComponent as GiftIcon } from "../../assets/gift.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";

const SUB_MENUS = {
  SUBSCRIPTIONS: "subscriptions",
  PAYMENT_CARDS: "payment-cards",
  ADDRESSES: "addresses",
  GIFTS: "gifts"
};
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      subscriptions: window.Pelcro.subscription.list(),
      giftRecipients:
        window.Pelcro.user.read()?.gift_recipients ?? [],
      disableSubmit: false,
      addresses: []
    };

    this.site = window.Pelcro.site.read();
    this.locale = this.props.t;
    this.user = window.Pelcro.user.read();
  }

  componentDidMount = () => {
    this.setState({
      isOpen: true
    });

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

        this.props.ReactGA.event({
          category: "ACTIONS",
          action: "Canceled",
          nonInteraction: true
        });

        this.props.onClose();
      }
    );
  };

  displayRedeem = () => {
    return this.props.setView("redeem");
  };

  displaySourceCreate = () => {
    return this.props.setView("source-create");
  };

  displayUserEdit = () => {
    return this.props.setView("user-edit");
  };

  displayProductSelect = () => {
    return this.props.setView("select");
  };

  displayAddressCreate = () => {
    return this.props.setView("address");
  };

  displayAddressEdit = (e) => {
    const address = e.currentTarget.dataset.key;
    this.props.setAddress(address);

    return this.props.setView("address-edit");
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
        this.props.onClose();
      }
    );
  };

  getSubscriptionStatus = (sub) => {
    const isSubscriptionEndingSoon = (sub) => {
      const weekFromNow =
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      const endingAt = new Date(sub.expires_at * 1000).getTime();

      return weekFromNow > endingAt && sub.cancel_at_period_end;
    };

    const isSubscriptionInTrial = (sub) => {
      if (!sub.trial_end) {
        return;
      }

      const now = new Date().getTime();
      const trialEndDate = new Date(sub.trial_end).getTime();

      return now < trialEndDate;
    };

    if (isSubscriptionEndingSoon(sub)) {
      return {
        title: this.locale("labels.status.endingSoon"),
        textColor: "text-orange-700",
        bgColor: "bg-orange-100",
        icon: <ExclamationIcon />
      };
    }

    if (isSubscriptionInTrial(sub)) {
      return {
        title: this.locale("labels.status.inTrial"),
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-100",
        icon: <CheckMarkIcon />
      };
    }

    return {
      title: this.locale("labels.status.active"),
      textColor: "text-green-700",
      bgColor: "bg-green-100",
      icon: <CheckMarkIcon />
    };
  };

  renderSubscriptions = () => {
    const subscriptions = this.state.subscriptions
      ?.sort((a, b) => a.expires_at - b.expires_at)
      .sort((a, b) => a.renews_at - b.renews_at)
      .map((sub) => {
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
          <tr
            key={"dashboard-subscription-" + sub.id}
            className="w-full align-top"
          >
            <td>
              {sub.plan.nickname && (
                <>
                  <span className="font-semibold text-gray-500">
                    {sub.plan.nickname}
                  </span>
                  <br />
                  <span className="text-xs text-gray-400">
                    {getFormattedPriceByLocal(
                      sub.plan.amount,
                      sub.plan.currency,
                      this.site.default_locale
                    )}
                  </span>
                </>
              )}
            </td>
            <td>
              {/* Pill */}
              <span
                className={`inline-flex p-1 text-xs font-semibold ${
                  this.getSubscriptionStatus(sub).bgColor
                } uppercase ${
                  this.getSubscriptionStatus(sub).textColor
                } rounded-lg`}
              >
                {this.getSubscriptionStatus(sub).icon}
                {this.getSubscriptionStatus(sub).title}
              </span>
              <br />
              <div className="mb-4 text-xs text-gray-500">
                {sub.status && (
                  <span className="inline-block mt-1 underline">
                    {status}
                  </span>
                )}
                <br />
                {sub.shipments_remaining && (
                  <span className="inline-block mt-1">
                    {sub.shipments_remaining}{" "}
                    {this.locale("labels.shipments")}
                  </span>
                )}
              </div>
            </td>

            <td>
              {sub.cancel_at_period_end === 0 && (
                <Button
                  variant="ghost"
                  className="text-red-400 focus:ring-red-300"
                  icon={<XCircleIcon />}
                  onClick={onCancelClick}
                  disabled={this.state.disableSubmit}
                  data-key={sub.id}
                >
                  {this.locale("labels.unsubscribe")}
                </Button>
              )}
              {sub.cancel_at_period_end === 1 && sub.plan.auto_renew && (
                <Button
                  variant="ghost"
                  className="text-green-400 focus:ring-green-300"
                  icon={<RefreshIcon />}
                  onClick={onReactivateClick}
                  disabled={this.state.disableSubmit}
                  data-key={sub.id}
                >
                  {this.locale("labels.reactivate")}
                </Button>
              )}
              {sub.cancel_at_period_end === 1 && (
                <Button
                  variant="ghost"
                  className="text-blue-400 focus:ring-blue-300"
                  icon={<RefreshIcon />}
                  onClick={onRenewClick}
                  disabled={this.state.disableSubmit}
                  data-key={sub.id}
                >
                  {this.locale("labels.renew")}
                </Button>
              )}
            </td>
          </tr>
        );
      });

    return (
      <table className="w-full table-fixed">
        <thead className="text-xs font-semibold tracking-wider text-gray-400 uppercase ">
          <tr>
            <th className="w-5/12 ">{this.locale("labels.plan")}</th>
            <th className="w-4/12 ">
              {this.locale("labels.status.title")}
            </th>
            <th className="w-3/12 ">
              {this.locale("labels.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Spacer */}
          <tr className="h-4"></tr>
          {subscriptions}
          <tr>
            <td colSpan="4" className="p-1">
              <Button
                variant="ghost"
                isFullWidth={true}
                icon={<PlusIcon className="w-4 mr-1" />}
                className="font-semibold tracking-wider uppercase rounded-none text-primary-700 hover:bg-primary-50"
                onClick={this.displayProductSelect}
              >
                {this.locale("labels.addSubscription")}
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan="4" className="p-1">
              <Button
                variant="ghost"
                isFullWidth={true}
                icon={<GiftIcon className="w-4 mr-1" />}
                className="font-semibold tracking-wider uppercase rounded-none text-primary-700 hover:bg-primary-50"
                onClick={this.displayRedeem}
              >
                {this.locale("labels.redeemGift")}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  renderGiftRecipients = () => {
    const { giftRecipients } = this.state;

    const giftedSubscriptions = giftRecipients
      ?.sort((a, b) => a.expires_at - b.expires_at)
      ?.sort((a, b) => a.renews_at - b.renews_at)
      ?.map((recipient) => {
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

        const subscriptionStatus = recipient.cancel_at_period_end
          ? `${this.locale("labels.expiresOn")} ${
              recipient.current_period_end
            }`
          : `${this.locale("labels.renewsOn")} ${
              recipient.current_period_end
            }`;

        return (
          <tr
            key={"dashboard-gift-recipients-" + recipient.id}
            className="align-top"
          >
            {/* User info section */}
            <td
              className="pr-2 text-gray-500 truncate"
              title={recipient.email}
            >
              {(recipient.first_name || recipient.last_name) && (
                <span className="font-semibold">
                  {recipient.first_name} {recipient.last_name}
                </span>
              )}
              <br />
              <span className="text-xs">{recipient.email}</span>
            </td>
            {/* Plan info section */}
            <td>
              {recipient.plan.nickname && (
                <>
                  <span className="font-semibold text-gray-500">
                    {recipient.plan.nickname}
                  </span>
                  <br />
                  <span className="text-xs text-gray-400">
                    {getFormattedPriceByLocal(
                      recipient.plan.amount,
                      recipient.plan.currency,
                      this.site.default_locale
                    )}
                  </span>
                </>
              )}
            </td>

            {/* Subscription status section */}
            {recipient.status && (
              <td>
                {/* Pill */}
                <span
                  className={`inline-flex p-1 text-xs font-semibold ${
                    this.getSubscriptionStatus(recipient).bgColor
                  } uppercase ${
                    this.getSubscriptionStatus(recipient).textColor
                  } rounded-lg`}
                >
                  {this.getSubscriptionStatus(recipient).icon}
                  {this.getSubscriptionStatus(recipient).title}
                </span>
                <br />
                <div className="mb-4 text-xs text-gray-500">
                  {recipient.status && (
                    <span className="inline-block mt-1 underline">
                      {subscriptionStatus}
                    </span>
                  )}
                </div>
              </td>
            )}

            {/* Recipient sub renew section */}
            {recipient.cancel_at_period_end === 1 && (
              <Button
                variant="ghost"
                icon={<RefreshIcon />}
                className="text-blue-400 focus:ring-blue-300"
                onClick={onRenewClick}
                disabled={this.state.disableSubmit}
                data-key={recipient.id}
              >
                {this.locale("labels.renew")}
              </Button>
            )}
          </tr>
        );
      });

    return (
      <table className="w-full table-fixed">
        <thead className="text-xs font-semibold tracking-wider text-gray-400 uppercase ">
          <tr>
            <th className="w-4/12 ">
              {this.locale("labels.recipient")}
            </th>
            <th className="w-3/12 ">{this.locale("labels.plan")}</th>
            <th className="w-3/12 ">
              {this.locale("labels.status.title")}
            </th>
            <th className="w-2/12 ">
              {this.locale("labels.actions")}
            </th>
          </tr>
        </thead>
        {/* Spacer */}
        <tr className="h-4"></tr>
        <tbody>
          {giftedSubscriptions}
          <tr>
            <td colSpan="4" className="p-1">
              <Button
                variant="ghost"
                isFullWidth={true}
                icon={<PlusIcon className="w-4 mr-1" />}
                className="font-semibold tracking-wider uppercase rounded-none text-primary-700 hover:bg-primary-50"
                onClick={this.displayProductSelect}
              >
                {this.locale("labels.addGift")}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  renderAddresses = () => {
    const addresses =
      this.state.addresses &&
      this.state.addresses.map((address, index) => {
        return (
          <tr key={"dashboard-address-" + address.id}>
            <td className="pr-2 text-gray-400 truncate">
              <span className="font-semibold text-gray-600">
                {address.city}, {address.country}
              </span>{" "}
              <span title={address.line1}>{address.line1}</span>
            </td>
            <td>
              <Button
                variant="icon"
                className="text-gray-500"
                icon={<EditIcon />}
                id={"pelcro-button-update-address-" + index}
                data-key={address.id}
                onClick={this.displayAddressEdit}
              ></Button>
            </td>
          </tr>
        );
      });

    return (
      <table className="w-full table-fixed">
        <thead className="text-xs font-semibold tracking-wider text-gray-400 uppercase ">
          <tr>
            <th className="w-10/12">
              {this.locale("labels.address")}
            </th>
            <th className="w-2/12">{this.locale("labels.edit")}</th>
          </tr>
        </thead>

        <tbody>
          {/* Spacer */}
          <tr className="h-4"></tr>
          {addresses}
          <tr>
            <td colSpan="2" className="p-1">
              <Button
                variant="ghost"
                isFullWidth={true}
                icon={<PlusIcon className="w-4 mr-1" />}
                className="font-semibold tracking-wider uppercase text-primary-700 hover:bg-primary-50"
                onClick={this.displayAddressCreate}
              >
                {this.locale("labels.addAddress")}
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  closeDashboard = () => {
    this.setState({
      isOpen: false
    });
  };

  render() {
    const { isOpen } = this.state;
    return (
      <Transition
        className="fixed inset-y-0 right-0 h-full max-w-xl overflow-y-auto text-left bg-white shadow-xl z-max"
        show={isOpen}
        enter="transform transition duration-500"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition duration-500"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        afterLeave={this.props.onClose}
      >
        <div id="pelcro-view-dashboard">
          <header className="flex flex-col p-2 bg-primary-500 h-52">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="w-8 text-gray-100 outline-none hover:text-gray-200"
                aria-label="Close"
                onClick={this.closeDashboard}
              >
                <ArrowLeftIcon />
              </button>
              {this.site.logo && (
                <img
                  alt="avatar"
                  className="w-10 h-10 p-1 bg-white rounded-full"
                  src={this.site.logo.url}
                />
              )}
            </div>

            <div className="flex flex-col justify-end flex-grow px-6">
              <div className="flex flex-col justify-center">
                {(this.user.first_name || this.user.last_name) && (
                  <p className="m-0 text-3xl font-bold text-white text">
                    <span className="text-lg opacity-80">
                      {this.locale("labels.hello")},
                    </span>
                    <br />
                    {this.user.first_name} {this.user.last_name}
                  </p>
                )}

                <p className="m-0 text-sm text-white">
                  {this.user.email}
                </p>
              </div>
              <div className="flex mt-2 space-x-2">
                <Button
                  variant="solid"
                  icon={<SettingsIcon />}
                  className="text-xs text-gray-700 capitalize bg-white hover:bg-gray-100"
                  onClick={this.displayUserEdit}
                >
                  {this.locale("labels.updateProfile")}
                </Button>
                <Button
                  variant="outline"
                  icon={<ExitIcon />}
                  className="text-xs text-white capitalize border-white hover:bg-white hover:text-gray-700"
                  onClick={this.props.logout}
                >
                  {this.locale("labels.logout")}
                </Button>
              </div>
            </div>
          </header>

          <section className="mt-6 shadow-sm">
            <header className="pl-8 mb-2">
              <p className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                {this.locale("labels.profile")}
              </p>
            </header>

            <Accordion initialActiveMenu={SUB_MENUS.ADDRESSES}>
              <Accordion.item
                name={SUB_MENUS.PAYMENT_CARDS}
                icon={<PaymentCardIcon />}
                title={this.locale("labels.paymentSource")}
                content={
                  <div className="flex items-center justify-between max-w-xs p-4 mb-2 text-white bg-gray-800 rounded-md h-14">
                    {getPaymentCardIcon(
                      this.user.source?.properties?.brand
                    )}
                    <span className="ml-1 text-lg tracking-widest">
                      •••• •••• ••••{" "}
                      {this.user.source?.properties?.last4}
                    </span>
                    <Button
                      variant="icon"
                      className="text-white"
                      icon={<EditIcon />}
                      onClick={this.displaySourceCreate}
                      disabled={this.state.disableSubmit}
                    ></Button>
                  </div>
                }
              />

              <Accordion.item
                name={SUB_MENUS.ADDRESSES}
                icon={<LocationIcon />}
                title={this.locale("labels.addresses")}
                content={this.renderAddresses()}
              />

              <Accordion.item
                name={SUB_MENUS.SUBSCRIPTIONS}
                icon={<BoxIcon />}
                title={this.locale("labels.subscriptions")}
                content={this.renderSubscriptions()}
              />

              <Accordion.item
                name={SUB_MENUS.GIFTS}
                icon={<GiftIcon />}
                title={this.locale("labels.gifts")}
                content={this.renderGiftRecipients()}
              />
            </Accordion>
          </section>
        </div>
      </Transition>
    );
  }
}

export const DashboardWithTrans = withTranslation("dashboard")(
  Dashboard
);
