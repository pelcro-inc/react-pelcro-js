import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { CartView } from "./CartView";

export const CartModal = ({ onDisplay, onClose, ...otherProps }) => {
  const {
    switchView,
    switchToAddressView,
    isAuthenticated
  } = usePelcro();

  const onSuccess = (items) => {
    otherProps.onSuccess?.(items);

    if (!isAuthenticated()) {
      return switchView("register");
    }

    switchToAddressView();
  };

  return (
    <Modal
      id="pelcro-cart-modal"
      onDisplay={onDisplay}
      onClose={onClose}
      hideCloseButton={false}
    >
      <ModalBody>
        <CartView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

CartModal.viewId = "cart";
