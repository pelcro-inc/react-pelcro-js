import React, { lazy, Suspense } from "react";
import ReactGA from "react-ga";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
// import { SubscriptionRenewView } from "./SubscriptionRenewView";
const SubscriptionRenewView = lazy(() =>
  import("./SubscriptionRenewView").then((module) => {
    return { default: module.SubscriptionRenewView };
  })
);

/**
 *
 */
export function SubscriptionRenewModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { product, switchView } = usePelcro();

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Renewed",
      nonInteraction: true
    });

    return switchView("subscription-success");
  };

  const onGiftRenewalSuccess = () => {
    otherProps.onGiftRenewalSuccess?.();
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Renewed Gift",
      nonInteraction: true
    });

    return switchView("subscription-success");
  };

  return (
    <Modal
      id="pelcro-subscription-renew-modal"
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
        <Suspense fallback={<p>Loading ...</p>}>
          <SubscriptionRenewView
            {...otherProps}
            onSuccess={onSuccess}
            onGiftRenewalSuccess={onGiftRenewalSuccess}
          />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

SubscriptionRenewModal.viewId = "subscription-renew";
