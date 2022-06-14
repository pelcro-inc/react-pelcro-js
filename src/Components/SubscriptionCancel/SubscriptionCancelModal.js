import React, {useEffect} from "react";
import Authorship from "../common/Authorship";
import { SubscriptionCancelView } from "./SubscriptionCancelView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const SubscriptionCancelModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const {subscriptionToCancel} = usePelcro();

  useEffect(() => {

    console.log("Selected Subscription", subscriptionToCancel);
  }, [subscriptionToCancel]);

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
