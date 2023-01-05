import React from "react";
import { useTranslation } from "react-i18next";
import { Card } from "../Card";
import QRCode from "react-qr-code";

export const QRCodeMenu = (props) => {
  const { t } = useTranslation("qr");
  const value = window.Pelcro.user.read().id
  ? `${window.Pelcro.environment.domain}/admin/${
      window.Pelcro.siteid
    }/customers/${window.Pelcro.user.read().id}`
  : `${window.Pelcro.environment.domain}/admin/${window.Pelcro.siteid}/customers`;

  return (
    <Card
      id="pelcro-dashboard-donation-menu"
      className="plc-max-w-100% md:plc-max-w-80% plc-m-auto"
      title={t("title")}
    >
      <QRCode style={{ margin: "auto" }} value={value} />
    </Card>
  );
};
