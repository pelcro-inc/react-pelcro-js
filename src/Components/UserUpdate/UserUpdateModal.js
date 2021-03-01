import React from "react";
import { UserUpdateView } from "./UserUpdateView";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";

export function UserUpdateModal({ onClose, ...otherProps }) {
  const site = window.Pelcro.site.read();

  return (
    <Modal id="pelcro-user-update-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      />
      <ModalBody>
        <UserUpdateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
