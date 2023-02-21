import React, { useContext, useEffect, useRef } from "react";
import { Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as ExitIcon } from "../../assets/exit.svg";
import { ReactComponent as XIcon } from "../../assets/x-icon.svg";
import { ReactComponent as CheckMarkIcon } from "../../assets/check-mark.svg";
import { ReactComponent as ExclamationIcon } from "../../assets/exclamation.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as UserIcon } from "../../assets/user.svg";
import { ReactComponent as NewsletterIcon } from "../../assets/newsletter.svg";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";
import { ReactComponent as InvoiceIcon } from "../../assets/document.svg";
import { ReactComponent as PaymentCardIcon } from "../../assets/payment-card.svg";
import { ReactComponent as LocationIcon } from "../../assets/location-pin.svg";
import { ReactComponent as SubscriptionIcon } from "../../assets/subscription.svg";
import { ReactComponent as GiftIcon } from "../../assets/gift.svg";
import { ReactComponent as ShoppingIcon } from "../../assets/shopping.svg";
import { ReactComponent as BookmarkIcon } from "../../assets/bookmark.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as KeyIcon } from "../../assets/key.svg";
import { ReactComponent as DonateIcon } from "../../assets/donate.svg";
import { ReactComponent as MembershipsIcon } from "../../assets/memberships.svg";
import userSolidIcon from "../../assets/user-solid.svg";
import { ReactComponent as QrCodeIcon } from "../../assets/qrcode.svg";
import { OrdersMenu } from "./DashboardMenus/OrdersMenu";
import { SavedItemsMenu } from "./DashboardMenus/SavedItemsMenu";
import { usePelcro } from "../../hooks/usePelcro";
import { SubscriptionsMenu } from "./DashboardMenus/SubsMenu";
import { DonationsMenu } from "./DashboardMenus/DonationsMenu";
import { InvoicesMenu } from "./DashboardMenus/InvoicesMenu";
import { MembershipsMenu } from "./DashboardMenus/MembershipsMenu";
import { DashboardLink } from "./DashboardLink";
import { GiftsMenu } from "./DashboardMenus/GiftsMenu";
import { AddressesMenu } from "./DashboardMenus/AddressesMenu";
import { PaymentCardsMenu } from "./DashboardMenus/PaymentCardsMenu";
import { QRCodeMenu } from "./DashboardMenus/QRCodeMenu";
import { ProfileMenu } from "./DashboardMenus/ProfileMenu";
import { NewslettersMenu } from "./DashboardMenus/NewslettersMenu";
import { PasswordChangeMenu } from "./DashboardMenus/PasswordChangeMenu";
import { store } from "./DashboardContainer";
import { hasActiveMemberships, hasDonationSubs, hasInvoices, showNewsletters } from "./utils";
import { CLOSE_DASHBOARD, SET_ACTIVE_DASHBOARD_LINK } from "../../utils/action-types";

const SUB_MENUS = {
  PROFILE: "profile",
  QRCODE: "qr-code",
  PASSWORDCHANGE: "passwordChange",
  SUBSCRIPTIONS: "subscriptions",
  DONATIONS: "donations",
  MEMBERSHIPS: "memberships",
  NEWSLETTERS: "Newsletters",
  PAYMENT_CARDS: "payment-cards",
  ADDRESSES: "addresses",
  GIFTS: "gifts",
  ORDERS: "orders",
  INVOICES: "invoices",
  LOGOUT: "logout",
  SAVED_ITEMS: "saved-items"
};

export const DashboardContent = (props) => {

  const {
    state: { isOpen, activeDashboardLink, disableSubmit },
    dispatch
  } = useContext(store);

  const { switchView, set, logout } = usePelcro();

  const { t } = useTranslation("dashboard");

  const menuRef = useRef(null);
  const user = window.Pelcro.user.read();
  const userHasName = user.first_name || user.last_name;
  const profilePicture =
    window.Pelcro.user.read().profile_photo ?? userSolidIcon;

  const newsletters = window.Pelcro?.uiSettings?.newsletters;
  const siteHasNewslettersDefined =
    Array.isArray(newsletters) && newsletters.length > 0;

    const initializeHideMenuHandler = () => {
      document.addEventListener("click", hideMenuIfClickedOutside);
    };
  
    const hideMenuIfClickedOutside = (event) => {
      const dashboardSubmenus = document.getElementById(
        "pelcro-view-dashboard-submenus"
      );
  
      const didClickOutsideMenu =
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !dashboardSubmenus?.contains(event.target);
  
      if (didClickOutsideMenu) {
        dispatch({ type: CLOSE_DASHBOARD });
      }
    };

    const setActiveDashboardLink = (submenuName) => {
      dispatch({
        type: SET_ACTIVE_DASHBOARD_LINK,
        payload: submenuName ?? null
      });
    };

    const displayProfilePicChange = () => {
      return switchView("profile-picture");
    };
    
    const setProductAndPlan = (product, plan, isGift) => {
      set({ product, plan, isGift });
    }

    const displayProductSelect = ({ isGift }) => {
      if (isGift) {
        setProductAndPlan(null, null, true);
      }
  
      return switchView("plan-select");
    };

    const getSubscriptionStatusText = (subscription) => {
      if (subscription.status === "canceled") {
        const cancelDate = new Date(subscription.canceled_at);
        const formattedCancelDate = new Intl.DateTimeFormat(
          "en-CA"
        ).format(cancelDate);
  
        return `${t(
          "labels.canceledOn"
        )} ${formattedCancelDate}`;
      }
  
      if (subscription.status === "incomplete") {
        return `${t("labels.status.incomplete")}`;
      }
  
      if (subscription.status === "extended") {
        // DateTime from BE is missing 3 zeros so we add them before instancing a date
        const expiryDate = new Date(
          Number(`${subscription.end_date}000`)
        );
        const formattedExpiryDate = new Intl.DateTimeFormat(
          "en-CA"
        ).format(expiryDate);
  
        return `${t("labels.until")} ${formattedExpiryDate}`;
      }
  
      if (subscription.cancel_at_period_end) {
        // DateTime from BE is missing 3 zeros so we add them before instancing a date
        const expiryDate = new Date(
          Number(`${subscription.expires_at}000`)
        );
        const formattedExpiryDate = new Intl.DateTimeFormat(
          "en-CA"
        ).format(expiryDate);
  
        return `${t(
          "labels.expiresOn"
        )} ${formattedExpiryDate}`;
      }
  
      const renewDate = new Date(
        Number(`${subscription.renews_at}000`)
      );
      const formattedRenewDate = new Intl.DateTimeFormat(
        "en-CA"
      ).format(renewDate);
  
      return `${t("labels.renewsOn")} ${formattedRenewDate}`;
    };
  
    const getSubscriptionStatus = (sub) => {
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
          title: t("labels.status.endingSoon"),
          content: getSubscriptionStatusText(sub),
          textColor: "plc-text-orange-700",
          bgColor: "plc-bg-orange-100",
          icon: <ExclamationIcon />
        };
      }
  
      if (isSubscriptionInTrial(sub)) {
        return {
          title: t("labels.status.inTrial"),
          content: getSubscriptionStatusText(sub),
          textColor: "plc-text-yellow-700",
          bgColor: "plc-bg-yellow-100",
          icon: <CheckMarkIcon />
        };
      }
  
      if (sub.status === "incomplete") {
        return {
          title: t("labels.status.incomplete"),
          content: getSubscriptionStatusText(sub),
          textColor: "plc-text-orange-700",
          bgColor: "plc-bg-orange-100",
          icon: <ExclamationIcon />
        };
      }
  
      if (sub.status === "canceled") {
        return {
          title: t("labels.status.canceled"),
          content: getSubscriptionStatusText(sub),
          textColor: "plc-text-red-700",
          bgColor: "plc-bg-red-100",
          icon: <ExclamationIcon />
        };
      }
  
      return {
        title: t("labels.status.active"),
        content: getSubscriptionStatusText(sub),
        textColor: "plc-text-green-700",
        bgColor: "plc-bg-green-100",
        icon: <CheckMarkIcon />
      };
    };

    const setSubscriptionIdToRenew = (subscriptionIdToRenew) => {
      set({ subscriptionIdToRenew })
    };

    const closeDashboard = () => {
      dispatch({ type: CLOSE_DASHBOARD });
    };

    useEffect(() => {
      return () => {
        document.removeEventListener(
          "click",
          hideMenuIfClickedOutside
        );
      }
    }, [])
    

    return (
      <>
        <Transition
          className="plc-fixed plc-inset-y-0 plc-left-0 plc-h-full lg:plc-w-3/12 plc-w-full plc-overflow-y-auto plc-text-left plc-bg-white plc-shadow-xl plc-z-max"
          show={isOpen}
          enter="plc-transform plc-transition plc-duration-500"
          enterFrom="plc--translate-x-full"
          enterTo="plc-translate-x-0"
          afterEnter={initializeHideMenuHandler}
          leave="plc-transform plc-transition plc-duration-500"
          leaveFrom="plc-translate-x-0"
          leaveTo="plc--translate-x-full"
          afterLeave={props?.onClose}
        >
          <div id="pelcro-view-dashboard" ref={menuRef}>
            <header className="plc-bg-gray-200 plc-flex plc-py-5">
              <div className="plc-flex plc-items-center">
                <div className="plc-flex plc-justify-center plc-ml-3 sm:plc-ml-6 plc-flex-shrink-0">
                  <div className="plc-relative plc-flex-shrink-0">
                    <img
                      className="pelcro-user-profile-picture plc-bg-gray-300 plc-cursor-pointer plc-h-10 plc-rounded-md plc-w-10"
                      src={profilePicture}
                      alt="profile picture"
                      onClick={displayProfilePicChange}
                    />
                  </div>
                </div>

                <div className="plc-flex plc-flex-col plc-justify-between plc-flex-grow plc-w-56 plc-ml-4 plc-break-words sm:plc-w-auto">
                  {userHasName && (
                    <p className="plc-font-bold plc-break-all">
                      {user.first_name} {user.last_name}
                    </p>
                  )}

                  <p
                    className={`plc-m-0 plc-text-sm plc-break-all ${
                      userHasName
                        ? "plc-text-sm"
                        : "plc-text-lg plc-font-bold plc-mt-auto"
                    }`}
                  >
                    {user.email}
                  </p>
                </div>
                <div className="lg:plc-hidden">
                  <Button
                    variant="ghost"
                    type="button"
                    className="plc-text-gray-500 plc-rounded-2xl plc-absolute plc-z-max plc-top-5 plc-right-10"
                    onClick={closeDashboard}
                  >
                    <XIcon className="plc-fill-current" />
                  </Button>
                </div>
              </div>
            </header>
            <section className="plc-mt-6 plc-shadow-sm">
              <header className="plc-pl-4 plc-mb-2 sm:plc-pl-8">
                <p className="plc-font-bold plc-tracking-widest plc-text-gray-500">
                  {t("labels.mySettings")}
                </p>
              </header>

              <DashboardLink
                name={SUB_MENUS.PROFILE}
                icon={
                  <UserIcon className="plc-w-6 plc-h-6 plc-mr-2" />
                }
                title={t("labels.profile")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                name={SUB_MENUS.QRCODE}
                icon={
                  <QrCodeIcon className="plc-w-6 plc-h-6 plc-mr-2" />
                }
                title={"My QR code"}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                name={SUB_MENUS.PASSWORDCHANGE}
                icon={
                  <KeyIcon className="plc-w-6 plc-h-6 plc-mr-2" />
                }
                title={t("labels.changePassword")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                name={SUB_MENUS.SAVED_ITEMS}
                icon={<BookmarkIcon />}
                title={t("labels.savedItems.label")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <header className="plc-pl-4 plc-mb-2 sm:plc-pl-8">
                <p className="plc-font-bold plc-tracking-widest plc-text-gray-500">
                  {t("labels.accountSettings")}
                </p>
              </header>

              <DashboardLink
                name={SUB_MENUS.PAYMENT_CARDS}
                icon={<PaymentCardIcon />}
                title={t("labels.paymentSource")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                name={SUB_MENUS.ADDRESSES}
                icon={<LocationIcon />}
                title={t("labels.addresses")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <header className="plc-pl-4 plc-my-2 sm:plc-pl-8">
                <p className="plc-font-bold plc-tracking-widest plc-text-gray-500">
                  {t("labels.purchases")}
                </p>
              </header>

              <DashboardLink
                name={SUB_MENUS.SUBSCRIPTIONS}
                icon={
                  <SubscriptionIcon className="plc-w-10 plc-h-10 plc-pt-2 plc-pr-1 plc--ml-2" />
                }
                title={t("labels.subscriptions")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                show={showNewsletters()}
                name={SUB_MENUS.NEWSLETTERS}
                icon={
                  <NewsletterIcon className="plc-transform plc--translate-x-1 plc-scale-105 plc-w-7 plc-h-8 plc-mr-1 plc-pt-1" />
                }
                title={t("labels.Newsletters")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                show={hasActiveMemberships()}
                name={SUB_MENUS.MEMBERSHIPS}
                icon={
                  <MembershipsIcon className="plc-transform plc-scale-120 plc-w-7 plc-h-8 plc-mr-1 plc-pt-1" />
                }
                title={t("labels.memberships")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                show={hasDonationSubs()}
                name={SUB_MENUS.DONATIONS}
                icon={
                  <DonateIcon className="plc-transform plc-scale-120 plc-w-7 plc-h-8 plc-mr-1 plc-pt-1" />
                }
                title={t("labels.donations")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                name={SUB_MENUS.GIFTS}
                icon={<GiftIcon />}
                title={t("labels.gifts")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                show={window.Pelcro.site.read().ecommerce_enabled}
                name={SUB_MENUS.ORDERS}
                icon={<ShoppingIcon />}
                title={t("labels.orders.label")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />

              <DashboardLink
                show={hasInvoices()}
                name={SUB_MENUS.INVOICES}
                icon={<InvoiceIcon />}
                title={t("labels.invoices")}
                setActiveDashboardLink={setActiveDashboardLink}
                activeDashboardLink={activeDashboardLink}
              />
            </section>
            <DashboardLink
              name={SUB_MENUS.LOGOUT}
              icon={<ExitIcon />}
              title={t("labels.logout")}
              setActiveDashboardLink={setActiveDashboardLink}
              activeDashboardLink={activeDashboardLink}
            />
          </div>
        </Transition>
        {activeDashboardLink && isOpen && (
          <div
            id="pelcro-view-dashboard-submenus"
            className="plc-fixed plc-inset-y-0 plc-right-0 plc-h-full lg:plc-w-9/12 plc-w-full plc-bg-gray-100 plc-z-max plc-overflow-auto"
          >
            {activeDashboardLink === SUB_MENUS.PROFILE && (
              <ProfileMenu />
            )}
            {activeDashboardLink === SUB_MENUS.QRCODE && (
              <QRCodeMenu />
            )}
            {activeDashboardLink ===
              SUB_MENUS.PASSWORDCHANGE && <PasswordChangeMenu />}
            {activeDashboardLink ===
              SUB_MENUS.SAVED_ITEMS && <SavedItemsMenu />}
            {activeDashboardLink ===
              SUB_MENUS.PAYMENT_CARDS && (
              <PaymentCardsMenu />
            )}
            {activeDashboardLink ===
              SUB_MENUS.ADDRESSES && (
              <AddressesMenu />
            )}
            {activeDashboardLink ===
              SUB_MENUS.SUBSCRIPTIONS && (
              <SubscriptionsMenu
                displayProductSelect={displayProductSelect}
                setProductAndPlan={setProductAndPlan}
                setSubscriptionIdToRenew={setSubscriptionIdToRenew}
                getSubscriptionStatus={getSubscriptionStatus}
              />
            )}
            {activeDashboardLink ===
              SUB_MENUS.MEMBERSHIPS && (
              <MembershipsMenu
                getSubscriptionStatus={getSubscriptionStatus}
              />
            )}
            {activeDashboardLink ===
              SUB_MENUS.NEWSLETTERS && <NewslettersMenu />}
            {activeDashboardLink ===
              SUB_MENUS.DONATIONS && (
              <DonationsMenu
                getSubscriptionStatus={getSubscriptionStatus}
              />
            )}
            {activeDashboardLink === SUB_MENUS.GIFTS && (
              <GiftsMenu
                getSubscriptionStatus={getSubscriptionStatus}
                displayProductSelect={displayProductSelect}
                setProductAndPlan={setProductAndPlan}
                setSubscriptionIdToRenew={setSubscriptionIdToRenew}
                disableSubmit={disableSubmit}
              />
            )}
            {activeDashboardLink === SUB_MENUS.ORDERS && (
              <OrdersMenu />
            )}
            {activeDashboardLink ===
              SUB_MENUS.INVOICES && <InvoicesMenu />}
            {activeDashboardLink === SUB_MENUS.LOGOUT && logout()}

            <Button
              variant="ghost"
              type="button"
              className="plc-text-gray-500 plc-rounded-2xl plc-absolute plc-z-max plc-top-2 plc-right-2 md:plc-top-5 md:plc-right-10"
              onClick={closeDashboard}
            >
              <XIcon className="plc-fill-current" />
            </Button>
          </div>
        )}
      </>
    );
}