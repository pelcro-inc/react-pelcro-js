import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordChangeView } from "./PasswordChangeView";

export const PasswordChangeModal = ({ onClose, ...otherProps }) => {
  const site = window.Pelcro.site.read();

  return (
    <Modal id="pelcro-password-change-modal">
      <ModalHeader
        hideCloseButton={false}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      />
      <ModalBody>
        <PasswordChangeView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
