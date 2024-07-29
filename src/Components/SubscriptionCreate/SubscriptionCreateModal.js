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
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";

/**
 *
 */
export function SubscriptionCreateModal({
  onDisplay,
  onClose,
  ...otherProps
}) {
  const { product, switchView, plan, giftRecipient } = usePelcro();

  const onSuccess = (res) => {
    otherProps.onSuccess?.(res);
    trackSubscriptionOnGA();

    return switchView("subscription-success");
  };

  const showBackButton = Boolean(product && plan && !giftRecipient);

  const userHasPaymentMethod = () => {
    const sources = window.Pelcro.user.read()?.sources ?? [];
    return sources.length > 0;
  };

  const userHasAddress = () => {
    const addresses = window.Pelcro.user.read()?.addresses ?? [];
    return addresses.length > 0;
  };

  const isUserHasPaymentMethod = userHasPaymentMethod();

  const isUserHasAddress = userHasAddress();

  const goBack = () => {
    if (product && plan && isUserHasPaymentMethod) {
      return switchView("payment-method-select");
    }

    if (
      product &&
      plan &&
      product.address_required &&
      isUserHasAddress
    ) {
      return switchView("address-select");
    }

    if (product && plan) {
      return switchView("plan-select");
    }
  };

  return (
    <Modal
      id="pelcro-subscription-create-modal"
      onDisplay={onDisplay}
    >
      <ModalHeader onCloseModal={onClose}>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          {showBackButton && (
            <button
              type="button"
              onClick={goBack}
              className="plc-absolute plc-w-6 plc-text-gray-500 focus:plc-text-black plc-z-max plc-top-1/2 plc-left-6 plc-transform plc--translate-y-1/2 plc-border-0 hover:plc-text-black hover:plc-shadow-none plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent"
            >
              <ArrowLeft />
            </button>
          )}
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
