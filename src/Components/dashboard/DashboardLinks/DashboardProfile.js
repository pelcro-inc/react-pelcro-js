import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as UserIcon } from "../../../assets/user.svg";
import { useTranslation } from "react-i18next";

export const DashboardProfile = ({ title, icon, store }) => {
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
      name={SUB_MENUS.PROFILE}
      icon={icon ?? <UserIcon className="plc-w-6 plc-h-6 plc-mr-2" />}
      title={title ?? t("labels.profile")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
