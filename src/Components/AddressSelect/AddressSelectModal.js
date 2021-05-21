import React from "react";
import Authorship from "../common/Authorship";
import { AddressSelectView } from "./AddressSelectView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const AddressSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { product, order, switchView, resetView } = usePelcro();

  const onSuccess = (selectedAddressId) => {
    otherProps.onSuccess?.(selectedAddressId);

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

  const onAddNewAddress = () => {
    switchView("address");
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="address-select"
    >
      <ModalBody>
        <AddressSelectView
          onAddNewAddress={onAddNewAddress}
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRedemptionSuccess={onGiftRedemptionSuccess}
          onFailure={otherProps.onFailure}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

AddressSelectModal.id = "address-select";
