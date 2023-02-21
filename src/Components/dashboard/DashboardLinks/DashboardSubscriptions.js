import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as SubscriptionIcon } from "../../../assets/subscription.svg";
import { useTranslation } from "react-i18next";

export const DashboardSubscriptions = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("dashboard");

  const setActiveDashboardLink = (submenuName) => {
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      name={SUB_MENUS.SUBSCRIPTIONS}
      icon={
        icon ?? (
          <SubscriptionIcon className="plc-w-10 plc-h-10 plc-pt-2 plc-pr-1 plc--ml-2" />
        )
      }
      title={title ?? t("labels.subscriptions")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
