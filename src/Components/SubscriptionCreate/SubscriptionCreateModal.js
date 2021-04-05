import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { SubscriptionCreateView } from "./SubscriptionCreateView";

export function SubscriptionCreateModal({
  plan,
  giftRecipient,
  product,
  onClose,
  onFailure = () => {},
  onSuccess = () => {},
  onDisplay = () => {}
}) {
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      id="pelcro-subscription-create-modal"
    >
      <ModalBody>
        <SubscriptionCreateView
          plan={plan}
          giftRecipient={giftRecipient}
          product={product}
          onDisplay={onDisplay}
          onFailure={onFailure}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
