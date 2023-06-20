import React from "react";
import { useTranslation } from "react-i18next";
import { UserUpdateView } from "./UserUpdateView";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *
 */
export function UserUpdateModal({
  onClose,
  onDisplay,
  ...otherProps
}) {
  const { switchView } = usePelcro();
  const { t } = useTranslation("userEdit");

  const onPictureClick = () => {
    switchView("profile-picture");
  };

  return (
    <Modal
      id="pelcro-user-update-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("labels.title")}
          </h4>
          <p className="plc-text-sm">{t("labels.subtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <UserUpdateView
          onPictureClick={onPictureClick}
          {...otherProps}
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

UserUpdateModal.viewId = "user-edit";
