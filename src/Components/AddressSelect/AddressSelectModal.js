import React from "react";
import Authorship from "../common/Authorship";
import { AddressSelectView } from "./AddressSelectView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export const AddressSelectModal = ({
  setView,
  onClose,
  ...otherProps
}) => {
  const onAddNewAddress = () => {
    setView("address");
  };

  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      id="pelcro-address-select-modal"
    >
      <ModalBody>
        <AddressSelectView
          onAddNewAddress={onAddNewAddress}
          {...otherProps}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
