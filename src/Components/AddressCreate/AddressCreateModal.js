import React from "react";
import Authorship from "../common/Authorship";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const AddressCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { product, order, switchView, resetView } = usePelcro();

  const onSuccess = (newAddressId) => {
    otherProps.onSuccess?.(newAddressId);

    if (product) {
      return switchView("payment");
    }

    if (order) {
      return switchView("orderCreate");
    }

    resetView();
  };

  const onGiftRedemptionSuccess = () => {
    otherProps.onGiftRedemptionSuccess?.();
    resetView();
  };

  const onFailure = () => {
    otherProps.onFailure?.();
  };

  return (
    <Modal id="address" onDisplay={onDisplay} onClose={onClose}>
      <ModalBody>
        <AddressCreateView
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRedemptionSuccess={onGiftRedemptionSuccess}
          onFailure={onFailure}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

AddressCreateModal.id = "address";
