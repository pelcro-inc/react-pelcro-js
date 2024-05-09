import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as ShoppingIcon } from "../../../assets/shopping.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardOrders = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchDashboardView } = usePelcro();

  const { t } = useTranslation("dashboard");

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("orders");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      show={window.Pelcro.site.read().ecommerce_enabled}
      name={SUB_MENUS.ORDERS}
      icon={icon ?? <ShoppingIcon />}
      title={title ?? t("labels.orders.label")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
