import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as PaymentCardIcon } from "../../../assets/payment-card.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardPaymentCards = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchDashboardView } = usePelcro();

  const { t } = useTranslation("dashboard");

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("payment-cards");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      name={SUB_MENUS.PAYMENT_CARDS}
      icon={icon ?? <PaymentCardIcon />}
      title={title ?? t("labels.paymentSource")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
