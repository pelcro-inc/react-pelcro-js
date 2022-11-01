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

  const onClose = () => {
    props.onClose?.();
    return resetView();
  };

  return (
    <Modal
      id="pelcro-subscription-success-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <PaymentSuccessView onClose={onClose} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

PaymentSuccessModal.viewId = "subscription-success";
