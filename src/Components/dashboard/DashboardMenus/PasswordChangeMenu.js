import React from "react";
import { useTranslation } from "react-i18next";
import { PasswordChangeView } from "../../PasswordChange/PasswordChangeView";
import { Card } from "../Card";

export const PasswordChangeMenu = () => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-profile-menu-width"
      title={t("labels.changePassword")}
    >
      <PasswordChangeView />
    </Card>
  );
};

PasswordChangeMenu.viewId = "password-change";
