import React from "react";
import { useTranslation } from "react-i18next";
import { InvoiceDetailsView } from "./InvoiceDetailsView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
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
      id="pelcro-invoice-details-modal"
      className="plc-subscriptions-menu-width"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("title")}
      />

      <ModalBody>
        <InvoiceDetailsView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

InvoiceDetailsModal.viewId = "invoice-details";
