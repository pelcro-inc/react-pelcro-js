import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../../../hooks/usePelcro";
import { UserUpdateView } from "../../../UserUpdate/UserUpdateView";
import { Card } from "../../Card";

export const ProfileMenu = (props) => {
  const { t } = useTranslation("dashboard");
  const { switchDashboardView } = usePelcro();

  const onPictureClick = () => {
    switchDashboardView("profile-picture");
  };

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-profile-menu-width"
      title={t("labels.profile")}
    >
      <UserUpdateView onPictureClick={onPictureClick} />
    </Card>
  );
};

ProfileMenu.viewId = "profile";
