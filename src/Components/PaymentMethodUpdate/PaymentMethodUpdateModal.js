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
  const site = window.Pelcro.site.read();

  return (
    <Modal id="pelcro-payment-method-update-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={props.onClose}
        logo={site.logo}
        title={site.name}
      ></ModalHeader>
      <ModalBody>
        <PaymentMethodUpdateView {...props} />
      </ModalBody>
      <ModalFooter>
        <Authorship></Authorship>
      </ModalFooter>
    </Modal>
  );
};
