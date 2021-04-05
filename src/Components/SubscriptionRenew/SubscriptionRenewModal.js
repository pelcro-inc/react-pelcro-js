import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionRenewView } from "./SubscriptionRenewView";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { Link } from "../../SubComponents/Link";

export function SubscriptionRenewModal({
  product,
  plan,
  subscriptionIdToRenew,
  isRenewingGift,
  onFailure,
  onSuccess,
  onDisplay,
  onGiftRenewalSuccess,
  logout,
  onClose
}) {
  const { t } = useTranslation("messages");
  const site = window.Pelcro.site.read();

  return (
    <Modal id="pelcro-subscription-renew-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
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
