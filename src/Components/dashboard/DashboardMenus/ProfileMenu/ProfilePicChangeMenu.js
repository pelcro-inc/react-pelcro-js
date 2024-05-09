import React from "react";
import { useTranslation } from "react-i18next";
// import { usePelcro } from "../../../../hooks/usePelcro";
import { ProfilePicChangeView } from "../../../ProfilePicChange/ProfilePicChangeView";
import { Card } from "../../Card";

export const ProfilePicChangeMenu = (props) => {
  const { t } = useTranslation("dashboard");

  return (
    <Card
      id="pelcro-dashboard-profile-menu"
      className="plc-max-w-100% md:plc-max-w-60% plc-m-auto"
      title={t("labels.profile")}
      back={{ target: "profile" }}
    >
      <ProfilePicChangeView
        onChangeSuccess={() => {
          console.log("Success");
        }}
      />
    </Card>
  );
};

ProfilePicChangeMenu.viewId = "profile-picture";
