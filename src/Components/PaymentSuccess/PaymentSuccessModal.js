import React, { useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PaymentSuccessView } from "./PaymentSuccessView";

export function PaymentSuccessModal({ onDisplay, onClose, product }) {
  useEffect(() => {
    window.Pelcro.insight.track("Modal Displayed", {
      name: "success"
    });

    onDisplay?.();
  });

  return (
    <Modal id="pelcro-payment-success-modal">
      <ModalBody>
        <PaymentSuccessView onClose={onClose} product={product} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
