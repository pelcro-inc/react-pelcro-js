import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordlessRequestView } from "./PasswordlessRequestView";

export const PasswordlessRequestModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  return (
    <Modal
      id="pelcro-passwordless-request-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <PasswordlessRequestView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PasswordlessRequestModal.viewId = "passwordless-request";
