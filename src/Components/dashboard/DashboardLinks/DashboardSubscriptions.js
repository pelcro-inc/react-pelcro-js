import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as SubscriptionIcon } from "../../../assets/subscription.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardSubscriptions = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchDashboardView } = usePelcro();
  const { t } = useTranslation("dashboard");

  // Check if user has active subscriptions
  const hasActiveSubscription = () => {
    const subs = window.Pelcro.user.read().subscriptions || [];
    return subs.some(sub => sub.status === "active");
  };

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("subscriptions");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      name={SUB_MENUS.SUBSCRIPTIONS}
      icon={icon ?? <SubscriptionIcon className="plc-w-5 plc-h-5" />}
      title={title ?? t("labels.subscriptions")}
      badge={hasActiveSubscription() ? "Active" : null}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
