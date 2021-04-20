import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordChangeView } from "./PasswordChangeView";

export const PasswordChangeModal = ({ onClose, ...otherProps }) => {
  return (
    <Modal
      hideCloseButton={false}
      onClose={onClose}
      id="pelcro-password-change-modal"
    >
      <ModalBody>
        <PasswordChangeView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
