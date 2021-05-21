import React from "react";
import { useTranslation } from "react-i18next";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { ProfilePicChangeContainer } from "./ProfilePicChangeContainer";
import { ProfilePicChangeWrapper } from "./ProfilePicChangeWrapper";

export const ProfilePicChangeView = (props) => {
  const { t } = useTranslation("userEdit");

  return (
    <div id="pelcro-profile-picture-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("labels.cropperTitle")}
        </h4>
        <p>{t("labels.cropperSubtitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <ProfilePicChangeContainer {...props}>
          <AlertWithContext />
          <ProfilePicChangeWrapper />
        </ProfilePicChangeContainer>
      </form>
    </div>
  );
};
