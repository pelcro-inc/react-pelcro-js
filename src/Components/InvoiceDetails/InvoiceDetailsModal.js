import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
// import { InvoiceDetailsView } from "./InvoiceDetailsView";
const InvoiceDetailsView = lazy(() =>
  import("./InvoiceDetailsView").then((module) => {
    return { default: module.InvoiceDetailsView };
  })
);

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
        <Suspense fallback={<p>Loading ...</p>}>
          <InvoiceDetailsView {...otherProps} onSuccess={onSuccess} />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

InvoiceDetailsModal.viewId = "invoice-details";
