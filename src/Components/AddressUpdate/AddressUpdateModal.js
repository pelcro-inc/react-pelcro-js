import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { AddressUpdateView } from "./AddressUpdateView";

export const AddressUpdateModal = ({ onClose, ...otherProps }) => {
  return (
    <Modal id="pelcro-address-update-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
      />
      <ModalBody>
        <AddressUpdateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
