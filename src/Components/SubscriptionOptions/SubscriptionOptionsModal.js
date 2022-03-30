import React from "react";
import Authorship from "../common/Authorship";
import { SubscriptionOptionsView } from "./SubscriptionOptionsView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
import { getRenewableProducts } from "../../utils/utils";

export const SubscriptionOptionsModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView, setProductsList } = usePelcro();

  const onRenewSubSuccess = () => {
    otherProps.onRenewSubSuccess?.();
    setProductsList(getRenewableProducts());
    switchView("_plan-select-renew");
  };

  const onNewSubSuccess = () => {
    otherProps.onNewSubSuccess?.();
    switchView("plan-select");
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-subscription-options-modal"
    >
      <ModalBody>
        <SubscriptionOptionsView
          {...otherProps}
          onNewSubSuccess={onNewSubSuccess}
          onRenewSubSuccess={onRenewSubSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

SubscriptionOptionsModal.viewId = "subscription-options";
