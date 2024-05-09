import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as GiftIcon } from "../../../assets/gift.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardGifts = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchDashboardView } = usePelcro();

  const { t } = useTranslation("dashboard");

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("gifts");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      name={SUB_MENUS.GIFTS}
      icon={icon ?? <GiftIcon />}
      title={title ?? t("labels.gifts")}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
