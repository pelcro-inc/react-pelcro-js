import React from "react";
import { useTranslation } from "react-i18next";
import { ProfilePicChangeView } from "./ProfilePicChangeView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

/**
 *
 */
export function ProfilePicChangeModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { t } = useTranslation("userEdit");

  return (
    <Modal
      id="pelcro-profile-picture-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("labels.cropperTitle")}
          </h4>
          <p className="plc-text-sm">{t("labels.cropperSubtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <ProfilePicChangeView {...otherProps} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

ProfilePicChangeModal.viewId = "profile-picture";
