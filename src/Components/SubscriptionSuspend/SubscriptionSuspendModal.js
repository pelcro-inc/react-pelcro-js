import React from "react";
import { SubscriptionSuspendView } from "./SubscriptionSuspendView";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";

export function SubscriptionSuspendModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { subscriptionToSuspend } = usePelcro();

  const { t } = useTranslation("subscriptionSuspend");

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-subscription-suspend-modal"
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("labels.title")}
            <span className="plc-text-gray-400 plc-text-base plc-block">
              ({subscriptionToSuspend.plan.nickname})
            </span>
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <SubscriptionSuspendView {...otherProps} />
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
}

SubscriptionSuspendModal.viewId = "subscription-suspend";
