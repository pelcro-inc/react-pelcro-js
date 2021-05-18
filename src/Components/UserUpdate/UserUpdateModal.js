import React from "react";
import { UserUpdateView } from "./UserUpdateView";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *
 */
export function UserUpdateModal({ onClose, setView, ...otherProps }) {
  const { switchView } = usePelcro();

  const onPictureClick = () => {
    switchView("profile-picture");
  };

  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      id="user-edit"
    >
      <ModalBody>
        <UserUpdateView
          onPictureClick={onPictureClick}
          {...otherProps}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

UserUpdateModal.id = "user-edit";
