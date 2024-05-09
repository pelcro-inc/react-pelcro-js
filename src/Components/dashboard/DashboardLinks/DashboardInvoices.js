import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { hasInvoices, SUB_MENUS } from "../utils";
import { ReactComponent as InvoiceIcon } from "../../../assets/document.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardInvoices = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchDashboardView } = usePelcro();

  const { t } = useTranslation("dashboard");

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("invoices");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      show={hasInvoices()}
      name={SUB_MENUS.INVOICES}
      icon={icon ?? <InvoiceIcon />}
      title={title ?? t("labels.invoices")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
