import React from "react";
import { ProfilePicChangeView } from "./ProfilePicChangeView";
import Authorship from "../common/Authorship";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export function ProfilePicChangeModal({
  onClose,
  hideHeaderLogo,
  ...otherProps
}) {
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      hideHeaderLogo={hideHeaderLogo}
      id="pelcro-profile-picture-modal"
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
