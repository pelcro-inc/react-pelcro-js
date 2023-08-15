import React from "react";
import { SubscriptionRenewView } from "./SubscriptionRenewView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

/**
 *
 */
export function SubscriptionRenewModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { product, switchView } = usePelcro();
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);
    if (enableReactGA4) {
      ReactGA4.event("Renewed", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Renewed",
        nonInteraction: true
      });
    }

    return switchView("subscription-success");
  };

  const onGiftRenewalSuccess = () => {
    otherProps.onGiftRenewalSuccess?.();
    if (enableReactGA4) {
      ReactGA4.event("Renewed Gift", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Renewed Gift",
        nonInteraction: true
      });
    }

    return switchView("subscription-success");
  };

  return (
    <Modal
      id="pelcro-subscription-renew-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {product?.paywall?.subscribe_title ??
              window.Pelcro.paywall.read()?.subscribe_title}
          </h4>{" "}
          <p className="plc-text-sm">
            {product?.paywall?.subscribe_subtitle ??
              window.Pelcro.paywall.read()?.subscribe_subtitle}
          </p>
        </div>
      </ModalHeader>
      <ModalBody>
        <SubscriptionRenewView
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRenewalSuccess={onGiftRenewalSuccess}
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

SubscriptionRenewModal.viewId = "subscription-renew";
