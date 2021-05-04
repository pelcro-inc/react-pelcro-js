import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordResetView } from "./PasswordResetView";

export const PasswordResetModal = ({
  onClose,
  hideHeaderLogo,
  ...otherProps
}) => {
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      hideHeaderLogo={hideHeaderLogo}
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
