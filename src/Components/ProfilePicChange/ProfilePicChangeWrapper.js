import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ProfilePicChangeButton } from "./ProfilePicChangeButton";
import { store } from "./ProfilePicChangeContainer";
import { ProfilePicChangeCropper } from "./ProfilePicChangeCropper";
import { ProfilePicChangeSelectButton } from "./ProfilePicChangeSelectButton";
import { ProfilePicChangeZoom } from "./ProfilePicChangeZoom";

export const ProfilePicChangeWrapper = () => {
  const {
    state: { imageSrc }
  } = useContext(store);

  const { t } = useTranslation("userEdit");

  return imageSrc ? (
    <>
      <ProfilePicChangeCropper />
      <ProfilePicChangeZoom className="plc-mt-2" />
      <ProfilePicChangeButton
        role="submit"
        className="plc-mt-2 plc-w-full"
        name={t("labels.save")}
        id="pelcro-submit"
      />
    </>
  ) : (
    <ProfilePicChangeSelectButton
      className="plc-mt-2"
      name={t("labels.selectImage")}
      id="pelcro-profile-picture-select"
    />
  );
};
