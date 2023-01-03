import React from "react";
import { useTranslation } from "react-i18next";
import { InvoiceDetailsView } from "./InvoiceDetailsView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const InvoiceDetailsModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchToPaymentView } = usePelcro();
  const { t } = useTranslation("invoiceDetails");

  const onSuccess = () => {
    otherProps.onSuccess?.();
    switchToPaymentView();
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-invoice-details-modal"
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("title")}
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <InvoiceDetailsView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

InvoiceDetailsModal.viewId = "invoice-details";
