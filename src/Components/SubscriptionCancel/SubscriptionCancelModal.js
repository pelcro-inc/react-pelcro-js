import React from "react";
import Authorship from "../common/Authorship";
import { SubscriptionCancelView } from "./SubscriptionCancelView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";

export const SubscriptionCancelModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-subscription-cancel-modal"
    >
      <ModalBody>
        <SubscriptionCancelView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

SubscriptionCancelModal.viewId = "subscription-cancel";
