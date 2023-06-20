import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { PasswordChangeView } from "./PasswordChangeView";

export const PasswordChangeModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("passwordChange");

  return (
    <Modal
      id="pelcro-password-change-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">{t("title")}</h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <PasswordChangeView {...otherProps} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PasswordChangeModal.viewId = "password-change";
