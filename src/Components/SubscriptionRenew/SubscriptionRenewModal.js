import React from "react";
import ReactGA from "react-ga";
import { SubscriptionRenewView } from "./SubscriptionRenewView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *
 */
export function SubscriptionRenewModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { switchView } = usePelcro();

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Renewed",
      nonInteraction: true
    });

    return switchView("success");
  };

  const onGiftRenewalSuccess = () => {
    otherProps.onGiftRenewalSuccess?.();
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Renewed Gift",
      nonInteraction: true
    });

    return switchView("success");
  };

  return (
    <Modal
      id="pelcro-subscription-renew-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <SubscriptionRenewView
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRenewalSuccess={onGiftRenewalSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

SubscriptionRenewModal.viewId = "subscription-renew";
