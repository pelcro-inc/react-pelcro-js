import React from "react";
import { SubscriptionRenewView } from "./SubscriptionRenewView";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";

export function SubscriptionRenewModal({
  product,
  plan,
  subscriptionIdToRenew,
  isRenewingGift,
  onFailure,
  onSuccess,
  onDisplay,
  onGiftRenewalSuccess,
  onClose
}) {
  return (
    <Modal id="pelcro-subscription-renew-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
      ></ModalHeader>

      <ModalBody>
        <SubscriptionRenewView
          plan={plan}
          subscriptionIdToRenew={subscriptionIdToRenew}
          isRenewingGift={isRenewingGift}
          product={product}
          onFailure={onFailure}
          onSuccess={onSuccess}
          onDisplay={onDisplay}
          onGiftRenewalSuccess={onGiftRenewalSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
