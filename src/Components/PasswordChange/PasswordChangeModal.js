import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordChangeView } from "./PasswordChangeView";

export const PasswordChangeModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  return (
    <Modal
      id="pelcro-password-change-modal"
      onDisplay={onDisplay}
      onClose={onClose}
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

PasswordChangeModal.viewId = "password-change";
