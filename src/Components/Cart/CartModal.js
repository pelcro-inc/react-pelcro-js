import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { CartView } from "./CartView";

export const CartModal = ({
  onClose,
  hideHeaderLogo,
  ...otherProps
}) => {
  return (
    <Modal
      hideCloseButton={false}
      onClose={onClose}
      id="pelcro-cart-modal"
    >
      <ModalBody>
        <CartView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
