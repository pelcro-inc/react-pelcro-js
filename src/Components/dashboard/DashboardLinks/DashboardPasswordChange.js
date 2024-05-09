import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as KeyIcon } from "../../../assets/key.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardPasswordChange = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("dashboard");

  const { switchDashboardView } = usePelcro();

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("password-change");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      name={SUB_MENUS.PASSWORDCHANGE}
      icon={icon ?? <KeyIcon className="plc-w-6 plc-h-6 plc-mr-2" />}
      title={title ?? t("labels.changePassword")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
