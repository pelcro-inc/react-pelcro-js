import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
// import { SubscriptionCancelView } from "./SubscriptionCancelView";
const SubscriptionCancelView = lazy(() =>
  import("./SubscriptionCancelView").then((module) => {
    return { default: module.SubscriptionCancelView };
  })
);

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
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("labels.title")}
            <span className="plc-text-gray-400 plc-text-base plc-block">
              ({subscriptionToCancel.plan.nickname})
            </span>
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <SubscriptionCancelView {...otherProps} />
        </Suspense>
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

SubscriptionCancelModal.viewId = "subscription-cancel";
