import React, { Component } from "react";
import ReactGA from "react-ga";
import { Transition } from "@headlessui/react";
import { withTranslation } from "react-i18next";
import { getFormattedPriceByLocal } from "../../utils/utils";
import { Button } from "../../SubComponents/Button";
import { getPaymentCardIcon } from "./utils";
import { Accordion } from "./Accordion";
import { ReactComponent as ExitIcon } from "../../assets/exit.svg";
import { ReactComponent as XIcon } from "../../assets/x-icon.svg";
import { ReactComponent as CheckMarkIcon } from "../../assets/check-mark.svg";
import { ReactComponent as ExclamationIcon } from "../../assets/exclamation.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as UserIcon } from "../../assets/user.svg";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";
import { ReactComponent as XCircleIcon } from "../../assets/x-icon-circle.svg";
import { ReactComponent as PaymentCardIcon } from "../../assets/payment-card.svg";
import { ReactComponent as LocationIcon } from "../../assets/location-pin.svg";
import { ReactComponent as SubscriptionIcon } from "../../assets/subscription.svg";
import { ReactComponent as GiftIcon } from "../../assets/gift.svg";
import { ReactComponent as ShoppingIcon } from "../../assets/shopping.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as KeyIcon } from "../../assets/key.svg";
import userSolidIcon from "../../assets/user-solid.svg";
import { OrdersMenu } from "./DashboardMenus/OrdersMenu";
import { usePelcro } from "../../hooks/usePelcro";

const SUB_MENUS = {
  PROFILE: "profile",
  SUBSCRIPTIONS: "subscriptions",
  PAYMENT_CARDS: "payment-cards",
  ADDRESSES: "addresses",
  GIFTS: "gifts",
  ORDERS: "orders"
};

/**
 *
 */
export function DashboardWithHook(props) {
  React.useEffect(() => {
    props.onDisplay?.();
  }, []);

  const { switchView, resetView, logout, set } = usePelcro();

  return (
    <DashboardWithTrans
      setAddress={(addressIdToEdit) => set({ addressIdToEdit })}
      setSubscriptionIdToRenew={(subscriptionIdToRenew) =>
        set({ subscriptionIdToRenew })
      }
      setIsRenewingGift={(isRenewingGift) => set({ isRenewingGift })}
      onClose={() => {
        props.onClose?.();
        resetView();
      }}
      logout={logout}
      setView={switchView}
      setProductAndPlan={(product, plan, isGift) =>
        set({ product, plan, isGift })
      }
    />
  );
}

DashboardWithHook.viewId = "dashboard";

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

    ReactGA?.event?.({
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

  displayChangePassword = () => {
    return this.props.setView("password-change");
  };

  displayProductSelect = ({ isGift }) => {
    if (isGift) {
      this.props.setProductAndPlan(null, null, true);
    }

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

  displayProfilePicChange = () => {
    return this.props.setView("profile-picture");
  };

  getSubscriptionStatusText = (subscription) => {
    if (subscription.status === "canceled") {
      const cancelDate = new Date(subscription.canceled_at);
      const formattedCancelDate = new Intl.DateTimeFormat(
        "en-CA"
      ).format(cancelDate);

      return `${this.locale(
        "labels.canceledOn"
      )} ${formattedCancelDate}`;
    }

    if (subscription.cancel_at_period_end) {
      return `${this.locale("labels.expiresOn")} ${
        subscription.current_period_end
      }`;
    }

    return `${this.locale("labels.renewsOn")} ${
      subscription.current_period_end
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
        content: this.getSubscriptionStatusText(sub),
        textColor: "plc-text-orange-700",
        bgColor: "plc-bg-orange-100",
        icon: <ExclamationIcon />
      };
    }

    if (isSubscriptionInTrial(sub)) {
      return {
        title: this.locale("labels.status.inTrial"),
        content: this.getSubscriptionStatusText(sub),
        textColor: "plc-text-yellow-700",
        bgColor: "plc-bg-yellow-100",
        icon: <CheckMarkIcon />
      };
    }

    return {
      title: this.locale("labels.status.active"),
      content: this.getSubscriptionStatusText(sub),
      textColor: "plc-text-green-700",
      bgColor: "plc-bg-green-100",
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

        return (
          <tr
            key={"dashboard-subscription-" + sub.id}
            className="plc-w-full plc-align-top"
          >
            <td>
              {sub.plan.nickname && (
                <>
                  <span className="plc-font-semibold plc-text-gray-500">
                    {sub.plan.nickname}
                  </span>
                  <br />
                  <span className="plc-text-xs plc-text-gray-400">
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
                className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold ${
                  this.getSubscriptionStatus(sub).bgColor
                } plc-uppercase ${
                  this.getSubscriptionStatus(sub).textColor
                } plc-rounded-lg`}
              >
                {this.getSubscriptionStatus(sub).icon}
                {this.getSubscriptionStatus(sub).title}
              </span>
              <br />
              <div className="plc-mb-4 plc-text-xs plc-text-gray-500">
                {sub.status && (
                  <span className="plc-inline-block plc-mt-1 plc-underline">
                    {this.getSubscriptionStatus(sub).content}
                  </span>
                )}
                <br />
                {sub.shipments_remaining ? (
                  <span className="plc-inline-block plc-mt-1">
                    {sub.shipments_remaining}{" "}
                    {this.locale("labels.shipments")}
                  </span>
                ) : null}
              </div>
            </td>

            <td>
              {sub.cancel_at_period_end === 0 && (
                <Button
                  variant="ghost"
                  className="plc-text-red-500 focus:plc-ring-red-500"
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
                  className="plc-text-green-400 focus:plc-ring-green-300"
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
                  className="plc-text-blue-400"
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
      <table className="plc-w-full plc-table-fixed">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-5/12 ">
              {this.locale("labels.plan")}
            </th>
            <th className="plc-w-4/12 ">
              {this.locale("labels.status.title")}
            </th>
            <th className="plc-w-3/12 ">
              {this.locale("labels.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Spacer */}
          <tr className="plc-h-4"></tr>
          {subscriptions}
          <tr>
            <td colSpan="4" className="plc-p-1">
              <Button
                variant="ghost"
                icon={
                  <PlusIcon className="plc-w-4 plc-h-4 plc-mr-1" />
                }
                className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase plc-rounded-none hover:plc-bg-gray-100"
                onClick={this.displayProductSelect}
              >
                {this.locale("labels.addSubscription")}
              </Button>
            </td>
          </tr>
          <tr>
            <td colSpan="4" className="plc-p-1">
              <Button
                variant="ghost"
                icon={
                  <GiftIcon className="plc-w-4 plc-h-4 plc-mr-1" />
                }
                className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase plc-rounded-none hover:plc-bg-gray-100"
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

        return (
          <tr
            key={"dashboard-gift-recipients-" + recipient.id}
            className="plc-align-top"
          >
            {/* User info section */}
            <td
              className="plc-pr-2 plc-text-gray-500 plc-truncate"
              title={recipient.email}
            >
              {(recipient.first_name || recipient.last_name) && (
                <span className="plc-font-semibold">
                  {recipient.first_name} {recipient.last_name}
                </span>
              )}
              <br />
              <span className="plc-text-xs">{recipient.email}</span>
            </td>
            {/* Plan info section */}
            <td>
              {recipient.plan.nickname && (
                <>
                  <span className="plc-font-semibold plc-text-gray-500">
                    {recipient.plan.nickname}
                  </span>
                  <br />
                  <span className="plc-text-xs plc-text-gray-400">
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
                  className={`plc-inline-flex plc-p-1 plc-text-xs plc-font-semibold ${
                    this.getSubscriptionStatus(recipient).bgColor
                  } plc-uppercase ${
                    this.getSubscriptionStatus(recipient).textColor
                  } plc-rounded-lg`}
                >
                  {this.getSubscriptionStatus(recipient).icon}
                  {this.getSubscriptionStatus(recipient).title}
                </span>
                <br />
                <div className="plc-mb-4 plc-text-xs plc-text-gray-500">
                  {recipient.status && (
                    <span className="plc-inline-block plc-mt-1 plc-underline">
                      {this.getSubscriptionStatus(recipient).content}
                    </span>
                  )}
                </div>
              </td>
            )}

            {/* Recipient sub renew section */}
            {recipient.cancel_at_period_end === 1 && (
              <td>
                <Button
                  variant="ghost"
                  icon={<RefreshIcon />}
                  className="plc-text-blue-400"
                  onClick={onRenewClick}
                  disabled={this.state.disableSubmit}
                  data-key={recipient.id}
                >
                  {this.locale("labels.renew")}
                </Button>
              </td>
            )}
          </tr>
        );
      });

    return (
      <table className="plc-w-full plc-table-fixed">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-4/12 ">
              {this.locale("labels.recipient")}
            </th>
            <th className="plc-w-3/12 ">
              {this.locale("labels.plan")}
            </th>
            <th className="plc-w-3/12 ">
              {this.locale("labels.status.title")}
            </th>
            <th className="plc-w-2/12 ">
              {this.locale("labels.actions")}
            </th>
          </tr>
        </thead>
        {/* Spacer */}
        <tbody>
          <tr className="plc-h-4"></tr>
          {giftedSubscriptions}
          <tr>
            <td colSpan="4" className="plc-p-1">
              <Button
                variant="ghost"
                icon={
                  <PlusIcon className="plc-w-4 plc-h-4 plc-mr-1" />
                }
                className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase plc-rounded-none hover:plc-bg-gray-100"
                onClick={() =>
                  this.displayProductSelect({ isGift: true })
                }
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
            <td className="plc-pr-2 plc-text-gray-400 plc-truncate">
              <span className="plc-font-semibold plc-text-gray-600">
                {address.city}, {address.country}
              </span>{" "}
              <span title={address.line1}>{address.line1}</span>
            </td>
            <td>
              <Button
                variant="icon"
                className="plc-text-gray-500"
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
      <table className="plc-w-full plc-table-fixed">
        <thead className="plc-text-xs plc-font-semibold plc-tracking-wider plc-text-gray-400 plc-uppercase ">
          <tr>
            <th className="plc-w-10/12">
              {this.locale("labels.address")}
            </th>
            <th className="plc-w-2/12">
              {this.locale("labels.edit")}
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Spacer */}
          <tr className="plc-h-4"></tr>
          {addresses}
          <tr>
            <td colSpan="2" className="plc-p-1">
              <Button
                variant="ghost"
                icon={<PlusIcon className="plc-w-4 plc-mr-1" />}
                className="plc-w-full plc-h-8 plc-font-semibold plc-tracking-wider plc-text-gray-900 plc-uppercase hover:plc-bg-gray-100"
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
    const userHasName = this.user.first_name || this.user.last_name;
    const profilePicture =
      window.Pelcro.user.read().profile_photo ?? userSolidIcon;

    return (
      <Transition
        className="plc-fixed plc-inset-y-0 plc-right-0 plc-h-full plc-max-w-xl plc-overflow-y-auto plc-text-left plc-bg-white plc-shadow-xl plc-z-max"
        show={isOpen}
        enter="plc-transform plc-transition plc-duration-500"
        enterFrom="plc-translate-x-full"
        enterTo="plc-translate-x-0"
        leave="plc-transform plc-transition plc-duration-500"
        leaveFrom="plc-translate-x-0"
        leaveTo="plc-translate-x-full"
        afterLeave={this.props.onClose}
      >
        <div id="pelcro-view-dashboard">
          <header className="plc-flex plc-flex-col plc-p-4 plc-pl-2 plc-min-h-40 sm:plc-pr-8 plc-bg-primary-500">
            <div className="plc-flex plc-flex-row-reverse">
              <Button
                variant="icon"
                className="plc-text-gray-100 plc-w-7 plc-h-7"
                icon={<XIcon />}
                onClick={this.closeDashboard}
              ></Button>
            </div>
            <div className="plc-flex plc-items-center">
              <div className="plc-flex plc-justify-center plc-ml-3 sm:plc-ml-6 ">
                <div className="plc-relative plc-flex-shrink-0">
                  <img
                    className="plc-w-24 plc-h-24 plc-bg-gray-300 plc-border-2 plc-border-white plc-border-solid plc-rounded-full plc-cursor-pointer pelcro-user-profile-picture"
                    src={profilePicture}
                    alt="profile picture"
                    onClick={this.displayProfilePicChange}
                  />
                  <Button
                    variant="icon"
                    className="plc-absolute plc-text-white plc-bg-gray-500 plc-w-7 plc-h-7 plc-top-16 plc--right-1 hover:plc-bg-gray-600 hover:plc-text-white"
                    icon={<EditIcon />}
                    id={"pelcro-user-update-picture-button"}
                    onClick={this.displayProfilePicChange}
                  />
                </div>
              </div>

              <div className="plc-flex plc-flex-col plc-justify-between plc-flex-grow plc-w-56 plc-ml-4 plc-break-words sm:plc-w-auto">
                {userHasName && (
                  <p className="plc-text-2xl plc-font-bold plc-text-white">
                    {this.user.first_name} {this.user.last_name}
                  </p>
                )}

                <p
                  className={`plc-m-0 plc-text-sm plc-text-white ${
                    userHasName
                      ? "plc-text-sm"
                      : "plc-text-lg plc-font-bold plc-mt-auto"
                  }`}
                >
                  {this.user.email}
                </p>
              </div>
            </div>
          </header>

          <section className="plc-mt-6 plc-shadow-sm">
            <header className="plc-pl-4 plc-mb-2 sm:plc-pl-8">
              <p className="plc-text-xs plc-font-bold plc-tracking-widest plc-text-gray-500 plc-uppercase">
                {this.locale("labels.account")}
              </p>
            </header>

            <Accordion>
              <Accordion.item
                name={SUB_MENUS.PROFILE}
                icon={
                  <UserIcon className="plc-w-6 plc-h-6 plc-mr-2" />
                }
                title={this.locale("labels.myProfile")}
                content={
                  <div className="plc-flex plc-flex-col plc-my-2 plc-ml-2 plc-space-y-4">
                    <Button
                      variant="ghost"
                      icon={
                        <EditIcon className="plc-w-5 plc-h-5 plc-mr-1" />
                      }
                      className="plc-text-sm plc-text-gray-500 hover:plc-text-primary-700"
                      onClick={this.displayUserEdit}
                    >
                      {this.locale("labels.updateProfile")}
                    </Button>

                    <Button
                      variant="ghost"
                      icon={
                        <KeyIcon className="plc-w-5 plc-h-5 plc-mr-1" />
                      }
                      className="plc-text-sm plc-text-gray-500 hover:plc-text-primary-700"
                      onClick={this.displayChangePassword}
                    >
                      {this.locale("labels.changePassword")}
                    </Button>
                  </div>
                }
              />

              <Accordion.item
                name={SUB_MENUS.PAYMENT_CARDS}
                icon={<PaymentCardIcon />}
                title={this.locale("labels.paymentSource")}
                content={
                  <div className="plc-flex plc-items-center plc-justify-between plc-max-w-xs plc-p-4 plc-mb-2 plc-text-white plc-bg-gray-800 plc-rounded-md plc-h-14">
                    {this.user.source ? (
                      <>
                        {getPaymentCardIcon(
                          this.user.source?.properties?.brand
                        )}
                        <span className="plc-ml-1 plc-text-lg plc-tracking-widest">
                          •••• {this.user.source?.properties?.last4}
                        </span>
                        <Button
                          variant="icon"
                          className="plc-text-white"
                          icon={<EditIcon />}
                          onClick={this.displaySourceCreate}
                          disabled={this.state.disableSubmit}
                        ></Button>
                      </>
                    ) : (
                      <>
                        <span>{this.locale("messages.noCard")}</span>
                        <Button
                          variant="icon"
                          className="plc-text-white"
                          icon={
                            <PlusIcon className="plc-w-6 plc-h-6" />
                          }
                          onClick={this.displaySourceCreate}
                          disabled={this.state.disableSubmit}
                        />
                      </>
                    )}
                  </div>
                }
              />

              <Accordion.item
                name={SUB_MENUS.ADDRESSES}
                icon={<LocationIcon />}
                title={this.locale("labels.addresses")}
                content={this.renderAddresses()}
              />

              <header className="plc-pl-4 plc-my-2 sm:plc-pl-8">
                <p className="plc-text-xs plc-font-bold plc-tracking-widest plc-text-gray-500 plc-uppercase">
                  {this.locale("labels.purchases")}
                </p>
              </header>

              <Accordion.item
                name={SUB_MENUS.SUBSCRIPTIONS}
                icon={
                  <SubscriptionIcon className="plc-w-10 plc-h-10 plc-pt-2 plc-pr-1 plc--ml-2" />
                }
                title={this.locale("labels.subscriptions")}
                content={this.renderSubscriptions()}
              />

              <Accordion.item
                name={SUB_MENUS.GIFTS}
                icon={<GiftIcon />}
                title={this.locale("labels.gifts")}
                content={this.renderGiftRecipients()}
              />

              <Accordion.item
                show={window.Pelcro.site.read().ecommerce_enabled}
                name={SUB_MENUS.ORDERS}
                icon={<ShoppingIcon />}
                title={this.locale("labels.orders.label")}
                content={<OrdersMenu />}
              />

              <Button
                variant="outline"
                icon={<ExitIcon />}
                className="plc-flex plc-items-center plc-justify-start plc-w-full plc-p-5 plc-px-4 plc-text-lg plc-font-normal plc-text-gray-500 plc-capitalize plc-bg-transparent plc-border-0 plc-border-l-2 plc-border-transparent plc-rounded-none plc-cursor-pointer plc-select-none sm:plc-px-8 hover:plc-bg-gray-100 hover:plc-text-gray-500"
                onClick={this.props.logout}
              >
                {this.locale("labels.logout")}
              </Button>
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
