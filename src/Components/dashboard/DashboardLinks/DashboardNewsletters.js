import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { showNewsletters, SUB_MENUS } from "../utils";
import { ReactComponent as NewsletterIcon } from "../../../assets/newsletter.svg";
import { useTranslation } from "react-i18next";

export const DashboardNewsletters = ({ title, icon, store }) => {
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
      show={showNewsletters()}
      name={SUB_MENUS.NEWSLETTERS}
      icon={
        icon ?? (
          <NewsletterIcon className="plc-transform plc--translate-x-1 plc-scale-105 plc-w-7 plc-h-8 plc-mr-1 plc-pt-1" />
        )
      }
      title={title ?? t("labels.Newsletters")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
