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
export function UserUpdateModal({
  onClose,
  onDisplay,
  ...otherProps
}) {
  const { switchView } = usePelcro();

  const onPictureClick = () => {
    switchView("profile-picture");
  };

  return (
    <Modal id="user-edit" onDisplay={onDisplay} onClose={onClose}>
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

UserUpdateModal.viewId = "user-edit";
