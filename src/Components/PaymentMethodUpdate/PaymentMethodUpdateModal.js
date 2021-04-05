import React from "react";
import { PaymentMethodUpdateView } from "./PaymentMethodUpdateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";

export const PaymentMethodUpdateModal = (props) => {
  return (
    <Modal id="pelcro-payment-method-update-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={props.onClose}
      ></ModalHeader>
      <ModalBody>
        <PaymentMethodUpdateView {...props} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
