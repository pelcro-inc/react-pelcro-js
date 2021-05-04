import React from "react";
import Authorship from "../common/Authorship";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export const AddressCreateModal = ({
  onClose,
  hideHeaderLogo,
  ...otherProps
}) => {
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      hideHeaderLogo={hideHeaderLogo}
      onClose={onClose}
      id="pelcro-address-create-modal"
    >
      <ModalBody>
        <AddressCreateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
