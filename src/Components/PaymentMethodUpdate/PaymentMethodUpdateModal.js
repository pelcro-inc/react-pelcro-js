import React from "react";
import ReactGA from "react-ga";
import { PaymentMethodUpdateView } from "./PaymentMethodUpdateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";

export const PaymentMethodUpdateModal = (props) => {
  const onSuccess = (res) => {
    props.onSuccess?.(res);
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Updated payment card",
      nonInteraction: true
    });
  };

  return (
    <Modal
      id="pelcro-payment-method-update-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalBody>
        <PaymentMethodUpdateView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PaymentMethodUpdateModal.viewId = "payment-method-update";
