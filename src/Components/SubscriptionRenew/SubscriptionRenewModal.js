import React from "react";
import { SubscriptionRenewView } from "./SubscriptionRenewView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";

/**
 *
 */
export function SubscriptionRenewModal({
  onClose,
  hideHeaderLogo,
  ...otherProps
}) {
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      id="pelcro-subscription-renew-modal"
    >
      <ModalBody>
        <SubscriptionRenewView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
