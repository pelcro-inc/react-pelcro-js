import React, { useEffect } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from "../ui/Modal";
import Authorship from "../common/Authorship";
import { PaymentSuccessView } from "./PaymentSuccessView";
import { useTranslation } from "react-i18next";

/**
 *
 */
export function PaymentSuccessModal({ onDisplay, ...props }) {
  const { resetView } = usePelcro();
  const { t } = useTranslation("payment");

  const onClose = () => {
    props.onClose?.();
    return resetView();
  };

  return (
    <Modal
      id="pelcro-subscription-success-modal"
      onDisplay={onDisplay}
    >
      <ModalHeader
        title={t("success.title", "Payment Successful")}
        description={t("success.description", "Your payment has been processed successfully.")}
        onCloseModal={onClose}
      />
      <ModalBody className="plc-mt-4">
        <PaymentSuccessView onClose={onClose} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

PaymentSuccessModal.viewId = "subscription-success";
