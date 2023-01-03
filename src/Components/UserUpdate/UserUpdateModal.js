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
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("labels.title")}
          </h4>
          <p>{t("labels.subtitle")}</p>
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
