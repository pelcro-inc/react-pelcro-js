import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordResetView } from "./PasswordResetView";

export const PasswordResetModal = ({ onClose, ...otherProps }) => {
  const site = window.Pelcro.site.read();
  return (
    <Modal id="pelcro-password-reset-modal">
      <ModalHeader
        hideCloseButton={false}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      />
      <ModalBody>
        <PasswordResetView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
