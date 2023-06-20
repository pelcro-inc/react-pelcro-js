import React from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionCancelView } from "./SubscriptionCancelView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
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
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("labels.title")}
            <span className="plc-text-gray-400 plc-text-base plc-block">
              ({subscriptionToCancel.plan.nickname})
            </span>
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <SubscriptionCancelView {...otherProps} />
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

SubscriptionCancelModal.viewId = "subscription-cancel";
