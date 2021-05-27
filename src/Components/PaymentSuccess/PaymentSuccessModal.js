import React, { useEffect } from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PaymentSuccessView } from "./PaymentSuccessView";

/**
 *
 */
export function PaymentSuccessModal({ onDisplay, ...props }) {
  const { resetView } = usePelcro();

  useEffect(() => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "success"
    });
  }, []);

  const onClose = () => {
    props.onClose?.();
    return resetView();
  };

  return (
    <Modal
      id="pelcro-payment-success-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <PaymentSuccessView onClose={onClose} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

PaymentSuccessModal.viewId = "success";
