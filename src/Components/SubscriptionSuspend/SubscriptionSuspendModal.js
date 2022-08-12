import React from "react";
import Authorship from "../common/Authorship";
import { SubscriptionSuspendView } from "./SubscriptionSuspendView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export const SubscriptionSuspendModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-subscription-suspend-modal"
    >
      <ModalBody>
        <SubscriptionSuspendView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

SubscriptionSuspendModal.viewId = "subscription-suspend";
