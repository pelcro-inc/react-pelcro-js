import React from "react";
import { useTranslation } from "react-i18next";
import { InvoicePaymentView } from "./InvoicePaymentView";
import {
  Modal,
  ModalHeader,
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
  const { t } = useTranslation("payment");

  const onSuccess = () => {
    otherProps.onSuccess?.();
    return switchView("subscription-success");
  };

  return (
    <Modal
      id="pelcro-invoice-payment-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("labels.checkout.title")}
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <InvoicePaymentView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

InvoicePaymentModal.viewId = "invoice-payment";
