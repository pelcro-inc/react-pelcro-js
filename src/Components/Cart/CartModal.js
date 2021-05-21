import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { displayAddressView } from "../../utils/utils";
import Authorship from "../common/Authorship";
import { CartView } from "./CartView";

export const CartModal = ({ onDisplay, onClose, ...otherProps }) => {
  const { switchView, resetView } = usePelcro();

  const onSuccess = (items) => {
    otherProps.onSuccess?.(items);

    if (!window.Pelcro.user.isAuthenticated()) {
      return switchView("register");
    }

    displayAddressView();
  };

  return (
    <Modal
      id="cart"
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

CartModal.id = "cart";
