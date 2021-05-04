import React from "react";
import { UserUpdateView } from "./UserUpdateView";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export function UserUpdateModal({
  onClose,
  setView,
  hideHeaderLogo,
  ...otherProps
}) {
  const onPictureClick = () => {
    setView("profile-picture");
  };

  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      hideHeaderLogo={hideHeaderLogo}
      id="pelcro-user-update-modal"
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
