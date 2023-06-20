import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { QrCodeView } from "./QrCodeView";

export const QrCodeModal = ({ onDisplay, onClose }) => {
  const { t } = useTranslation("qr");

  return (
    <Modal
      id="pelcro-qrcode-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">{t("title")}</h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <QrCodeView />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

QrCodeModal.viewId = "qrcode";
