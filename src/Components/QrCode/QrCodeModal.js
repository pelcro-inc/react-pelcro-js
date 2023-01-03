import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
// import { QrCodeView } from "./QrCodeView";
const QrCodeView = lazy(() =>
  import("./QrCodeView").then((module) => {
    return { default: module.QrCodeView };
  })
);

export const QrCodeModal = ({ onDisplay, onClose }) => {
  const { t } = useTranslation("qr");

  return (
    <Modal
      id="pelcro-qrcode-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("title")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <QrCodeView />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

QrCodeModal.viewId = "qrcode";
