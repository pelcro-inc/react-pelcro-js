import React, { useContext } from "react";
import { DashboardLink } from "../DashboardLink";
import { SET_ACTIVE_DASHBOARD_LINK } from "../../../utils/action-types";
import { SUB_MENUS } from "../utils";
import { ReactComponent as QrCodeIcon } from "../../../assets/qrcode.svg";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../hooks/usePelcro";

export const DashboardQRCode = ({ title, icon, store }) => {
  const {
    state: { activeDashboardLink },
    dispatch
  } = useContext(store);

  const { switchDashboardView } = usePelcro();

  const { t } = useTranslation("dashboard");

  const setActiveDashboardLink = (submenuName) => {
    switchDashboardView("qr-code");
    dispatch({
      type: SET_ACTIVE_DASHBOARD_LINK,
      payload: submenuName ?? null
    });
  };

  return (
    <DashboardLink
      name={SUB_MENUS.QRCODE}
      icon={
        icon ?? <QrCodeIcon className="plc-w-6 plc-h-6 plc-mr-2" />
      }
      title={title ?? "My QR code"}
      setActiveDashboardLink={setActiveDashboardLink}
      activeDashboardLink={activeDashboardLink}
    />
  );
};
