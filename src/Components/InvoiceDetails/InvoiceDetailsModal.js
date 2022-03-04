import React from "react";
import Authorship from "../common/Authorship";
import { InvoiceDetailsView } from "./InvoiceDetailsView";
import {
  Modal,
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
      <ModalBody>
        <InvoiceDetailsView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

InvoiceDetailsModal.viewId = "invoice-details";
