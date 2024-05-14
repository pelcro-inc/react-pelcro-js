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
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      title={t("labels.profile")}
    >
      <UserUpdateView onPictureClick={onPictureClick} />
    </Card>
  );
};

ProfileMenu.viewId = "profile";