import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { trackSubscriptionOnGA } from "../../utils/utils";
import { SubscriptionCreateView } from "./SubscriptionCreateView";

/**
 *
 */
export function SubscriptionCreateModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { product, switchView } = usePelcro();

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);
    trackSubscriptionOnGA();

    return switchView("subscription-success");
  };

  return (
    <Modal
      id="pelcro-subscription-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold ">
            {product?.paywall?.subscribe_title ??
              window.Pelcro.paywall.read()?.subscribe_title}
          </h4>{" "}
          <p>
            {product?.paywall?.subscribe_subtitle ??
              window.Pelcro.paywall.read()?.subscribe_subtitle}
          </p>
        </div>
      </ModalHeader>
      <ModalBody>
        <SubscriptionCreateView
          {...otherProps}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

SubscriptionCreateModal.viewId = "subscription-create";
