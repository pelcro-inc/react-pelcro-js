import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { CartView } from "./CartView";

export const CartModal = ({ onClose, ...otherProps }) => {
  const site = window.Pelcro.site.read();
  return (
    <Modal id="pelcro-cart-modal">
      <ModalHeader
        hideCloseButton={false}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      />
      <ModalBody>
        <CartView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
