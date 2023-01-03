import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
// import { InvoicePaymentView } from "./InvoicePaymentView";
const InvoicePaymentView = lazy(() =>
  import("./InvoicePaymentView").then((module) => {
    return { default: module.InvoicePaymentView };
  })
);

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
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold ">
            {t("labels.checkout.title")}
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <InvoicePaymentView {...otherProps} onSuccess={onSuccess} />
        </Suspense>
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

InvoicePaymentModal.viewId = "invoice-payment";
