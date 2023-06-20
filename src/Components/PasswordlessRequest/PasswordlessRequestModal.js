import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordlessRequestView } from "./PasswordlessRequestView";

export const PasswordlessRequestModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("passwordlessRequest");

  return (
    <Modal
      id="pelcro-password-forgot-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">{t("title")}</h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <PasswordlessRequestView {...otherProps} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PasswordlessRequestModal.viewId = "passwordless-request";
