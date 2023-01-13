import React from "react";
import Authorship from "../common/Authorship";
import { SubscriptionManageMembersView } from "./SubscriptionManageMembersView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

/**
 *
 */
export function SubscriptionManageMembersModal({ onDisplay, onClose, ...props }) {

  const onSuccess = (res) => {
    props.onSuccess?.(res);
  };

  return (
    <Modal
      id="pelcro-manage-members-modal"
      onDisplay={onDisplay}
      onClose={onClose}
      className="plc-max-w-xl"
    >
      <ModalBody>
        <SubscriptionManageMembersView
          {...props}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

SubscriptionManageMembersModal.viewId = "manage-members";
