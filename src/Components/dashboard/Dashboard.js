import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";
import { DashboardContainer } from "./DashboardContainer";
import { DashboardContent } from "./DashboardContent";
import { DashboardHeading } from "./DashboardHeading";
import { DashboardProfile } from "./DashboardLinks/DashboardProfile";
import { DashboardQRCode } from "./DashboardLinks/DashboardQRCode";
import { DashboardPasswordChange } from "./DashboardLinks/DashboardPasswordChange";
import { DashboardSavedItems } from "./DashboardLinks/DashboardSavedItems";
import { DashboardPaymentCards } from "./DashboardLinks/DashboardPaymentCards";
import { DashboardAddresses } from "./DashboardLinks/DashboardAddresses";
import { DashboardSubscriptions } from "./DashboardLinks/DashboardSubscriptions";
import { DashboardNewsletters } from "./DashboardLinks/DashboardNewsletters";
import { DashboardMemberships } from "./DashboardLinks/DashboardMemberships";
import { DashboardDonations } from "./DashboardLinks/DashboardDonations";
import { DashboardGifts } from "./DashboardLinks/DashboardGifts";
import { DashboardOrders } from "./DashboardLinks/DashboardOrders";
import { DashboardInvoices } from "./DashboardLinks/DashboardInvoices";
import { ProfileMenu } from "./DashboardMenus/ProfileMenu/ProfileMenu";
import { ProfilePicChangeMenu } from "./DashboardMenus/ProfileMenu/ProfilePicChangeMenu";
import { QRCodeMenu } from "./DashboardMenus/QRCodeMenu";
import { PasswordChangeMenu } from "./DashboardMenus/PasswordChangeMenu";
import { SavedItemsMenu } from "./DashboardMenus/SavedItemsMenu";
import { PaymentCardsMenu } from "./DashboardMenus/PaymentMethodsMenu/PaymentCardsMenu";
import { PaymentMethodCreateMenu } from "./DashboardMenus/PaymentMethodsMenu/PaymentMethodCreateMenu";
import { PaymentMethodUpdateMenu } from "./DashboardMenus/PaymentMethodsMenu/PaymentMethodUpdateMenu";
import { PaymentMethodDeleteMenu } from "./DashboardMenus/PaymentMethodsMenu/PaymentMethodDeleteMenu";
import { AddressesMenu } from "./DashboardMenus/AddressesMenu/AddressesMenu";
import { AddressCreateMenu } from "./DashboardMenus/AddressesMenu/AddressCreateMenu";
import { AddressEditMenu } from "./DashboardMenus/AddressesMenu/AddressEditMenu";
import { SubscriptionsMenu } from "./DashboardMenus/SubsMenu";
import { MembershipsMenu } from "./DashboardMenus/MembershipsMenu";
import { NewslettersMenu } from "./DashboardMenus/NewslettersMenu";
import { DonationsMenu } from "./DashboardMenus/DonationsMenu";
import { GiftsMenu } from "./DashboardMenus/GiftsMenu";
import { OrdersMenu } from "./DashboardMenus/OrdersMenu";
import { InvoicesMenu } from "./DashboardMenus/InvoicesMenu";
import { ReactComponent as CheckMarkIcon } from "../../assets/check-mark.svg";
import { ReactComponent as ExclamationIcon } from "../../assets/exclamation.svg";

/**
 *
 */
export function Dashboard({ dashboardLayout = "left", ...props }) {
  React.useEffect(() => {
    props.onDisplay?.();
  }, []);

  const { resetView, set, switchView } = usePelcro();
  const { t } = useTranslation("dashboard");
  const setProductAndPlan = (product, plan, isGift) => {
    set({ product, plan, isGift });
  };

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

      return `${t("labels.canceledOn")} ${formattedCancelDate}`;
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

      return `${t("labels.expiresOn")} ${formattedExpiryDate}`;
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
    set({ subscriptionIdToRenew });
  };
  return (
    <DashboardContainer {...props}>
      <DashboardContent
        onClose={() => {
          props.onClose?.();
          resetView();
        }}
        dashboardLayout={dashboardLayout}
        subView={[
          <ProfileMenu key={1} />,
          <ProfilePicChangeMenu key={2} />,
          <QRCodeMenu key={3} />,
          <PasswordChangeMenu key={4} />,
          <SavedItemsMenu key={5} />,
          <PaymentCardsMenu key={6} />,
          <PaymentMethodCreateMenu key={7} />,
          <PaymentMethodUpdateMenu key={8} />,
          <PaymentMethodDeleteMenu key={9} />,

          <AddressesMenu key={10} />,
          <AddressCreateMenu key={11} />,
          <AddressEditMenu key={12} />,
          <SubscriptionsMenu
            key={13}
            displayProductSelect={displayProductSelect}
            setProductAndPlan={setProductAndPlan}
            setSubscriptionIdToRenew={setSubscriptionIdToRenew}
            getSubscriptionStatus={getSubscriptionStatus}
          />,
          <MembershipsMenu
            key={14}
            getSubscriptionStatus={getSubscriptionStatus}
          />,
          <NewslettersMenu key={15} />,
          <DonationsMenu
            key={16}
            getSubscriptionStatus={getSubscriptionStatus}
          />,
          <GiftsMenu
            key={17}
            getSubscriptionStatus={getSubscriptionStatus}
            displayProductSelect={displayProductSelect}
            setProductAndPlan={setProductAndPlan}
            setSubscriptionIdToRenew={setSubscriptionIdToRenew}
          />,
          <OrdersMenu key={18} />,
          <InvoicesMenu key={19} />
        ]}
        {...props}
      >
        <DashboardHeading title={t("labels.mySettings")} />
        <DashboardProfile />
        <DashboardQRCode />
        <DashboardPasswordChange />
        <DashboardSavedItems />

        <DashboardHeading title={t("labels.accountSettings")} />
        <DashboardPaymentCards />
        <DashboardAddresses />
        <DashboardHeading title={t("labels.purchases")} />

        <DashboardSubscriptions />
        <DashboardNewsletters />
        <DashboardMemberships />
        <DashboardDonations />
        <DashboardGifts />
        <DashboardOrders />
        <DashboardInvoices />
      </DashboardContent>
    </DashboardContainer>
  );
}

Dashboard.viewId = "dashboard";
