import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { SubscriptionCreateView } from "./SubscriptionCreateView";

/**
 *
 */
export function SubscriptionCreateModal({
  onClose,
  hideHeaderLogo,
  ...otherProps
}) {
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      id="pelcro-subscription-create-modal"
    >
      <ModalBody>
        <SubscriptionCreateView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
