import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { ProfilePicChangeButton } from "./ProfilePicChangeButton";
import { store } from "./ProfilePicChangeContainer";
import { ProfilePicChangeCropper } from "./ProfilePicChangeCropper";
import { ProfilePicChangeRemoveButton } from "./ProfilePicChangeRemoveButton";
import { ProfilePicChangeSelectButton } from "./ProfilePicChangeSelectButton";
import { ProfilePicChangeZoom } from "./ProfilePicChangeZoom";

export const ProfilePicChangeWrapper = () => {
  const {
    state: { imageSrc }
  } = useContext(store);

  const { t } = useTranslation("userEdit");

  const currentProfilePicture = window.Pelcro.user.read()
    .profile_photo;

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
    <div className="plc-flex plc-flex-col plc-justify-center plc-items-center">
      {currentProfilePicture && (
        <img
          className="plc-border-white plc-border-2 plc-border-solid plc-rounded-full plc-w-36 plc-h-36 plc-bg-gray-300 pelcro-profile-picture-preview"
          src={currentProfilePicture}
          alt="profile picture"
        />
      )}
      <ProfilePicChangeSelectButton
        className="plc-mt-2 plc-w-full"
        name={t("labels.selectImage")}
        id="pelcro-profile-picture-select"
      />
      {currentProfilePicture && (
        <ProfilePicChangeRemoveButton
          className="plc-mt-1 plc-w-full plc-bg-gray-600 hover:plc-bg-gray-900 disabled:plc-bg-gray-400"
          name={t("labels.removeImage")}
          id="pelcro-profile-picture-remove"
        />
      )}
    </div>
  );
};
