import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordResetView } from "./PasswordResetView";

export const PasswordResetModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-password-reset-modal"
    >
      <ModalBody>
        <PasswordResetView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PasswordResetModal.viewId = "password-reset";
