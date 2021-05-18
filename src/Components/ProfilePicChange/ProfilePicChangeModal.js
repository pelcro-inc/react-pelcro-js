import React from "react";
import { ProfilePicChangeView } from "./ProfilePicChangeView";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

/**
 *
 */
export function ProfilePicChangeModal({ onClose, ...otherProps }) {
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      id="profile-picture"
    >
      <ModalBody>
        <ProfilePicChangeView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

ProfilePicChangeModal.id = "profile-picture";
