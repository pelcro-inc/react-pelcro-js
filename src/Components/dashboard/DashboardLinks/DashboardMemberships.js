import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { hasActiveMemberships, SUB_MENUS } from "../utils";
import { ReactComponent as MembershipsIcon } from "../../../assets/memberships.svg";
import { useTranslation } from "react-i18next";

export const DashboardMemberships = ({ title, icon, store }) => {
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
      show={hasActiveMemberships()}
      name={SUB_MENUS.MEMBERSHIPS}
      icon={
        icon ?? (
          <MembershipsIcon className="plc-transform plc-scale-120 plc-w-7 plc-h-8 plc-mr-1 plc-pt-1" />
        )
      }
      title={title ?? t("labels.memberships")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
