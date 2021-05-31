import React from "react";
import Authorship from "../common/Authorship";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
import { displayPaymentView } from "../../utils/utils";

export const AddressCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { resetView } = usePelcro();

  const onSuccess = (newAddressId) => {
    otherProps.onSuccess?.(newAddressId);

    displayPaymentView();
  };

  const onGiftRedemptionSuccess = () => {
    otherProps.onGiftRedemptionSuccess?.();
    resetView();
  };

  return (
    <Modal
      id="pelcro-address-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <AddressCreateView
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRedemptionSuccess={onGiftRedemptionSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

AddressCreateModal.viewId = "address";
