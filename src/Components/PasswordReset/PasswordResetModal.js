import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { PasswordResetView } from "./PasswordResetView";

export const PasswordResetModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("passwordReset");

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-password-reset-modal"
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">{t("title")}</h4>
          <p className="plc-text-sm">{t("subtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <PasswordResetView {...otherProps} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PasswordResetModal.viewId = "password-reset";
