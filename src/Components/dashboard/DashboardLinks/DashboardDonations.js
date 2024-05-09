import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { hasDonationSubs, SUB_MENUS } from "../utils";
import { ReactComponent as DonateIcon } from "../../../assets/donate.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardDonations = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchDashboardView } = usePelcro();

  const { t } = useTranslation("dashboard");

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("donations");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      show={hasDonationSubs()}
      name={SUB_MENUS.DONATIONS}
      icon={
        icon ?? (
          <DonateIcon className="plc-transform plc-scale-120 plc-w-7 plc-h-8 plc-mr-1 plc-pt-1" />
        )
      }
      title={title ?? t("labels.donations")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
