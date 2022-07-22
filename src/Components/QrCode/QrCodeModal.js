import React from "react";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { QrCodeView } from "./QrCodeView";

export const QrCodeModal = ({ onDisplay, onClose }) => {
  return (
    <Modal
      id="pelcro-qrcode-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <QrCodeView />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

QrCodeModal.viewId = "qrcode";
