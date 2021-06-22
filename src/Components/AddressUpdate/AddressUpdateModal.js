import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { AddressUpdateView } from "./AddressUpdateView";

export const AddressUpdateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  return (
    <Modal
      id="pelcro-address-update-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <AddressUpdateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

AddressUpdateModal.viewId = "address-edit";
