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
export function ProfilePicChangeModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  return (
    <Modal
      id="pelcro-profile-picture-modal"
      onDisplay={onDisplay}
      onClose={onClose}
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

ProfilePicChangeModal.viewId = "profile-picture";
