import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionCancelView } from "./SubscriptionCancelView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const SubscriptionCancelModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { subscriptionToCancel } = usePelcro();
  const { t } = useTranslation("subscriptionCancel");

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-subscription-cancel-modal"
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("labels.title")}
        description={`(${subscriptionToCancel.plan.nickname})`}
      />

      <ModalBody >
        <SubscriptionCancelView {...otherProps} />
      </ModalBody>

      <ModalFooter/>
    </Modal>
  );
};

SubscriptionCancelModal.viewId = "subscription-cancel";
