import React from "react";
import Authorship from "../common/Authorship";
import { InvoicePaymentView } from "./InvoicePaymentView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const InvoicePaymentModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView } = usePelcro();

  const onSuccess = () => {
    otherProps.onSuccess?.();
    return switchView("invoice-payment-success");
  };

  return (
    <Modal
      id="pelcro-invoice-payment-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <InvoicePaymentView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

InvoicePaymentModal.viewId = "invoice-payment";
