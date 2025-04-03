import React from "react";
import { usePelcro } from "../../hooks/usePelcro";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
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
  const { t } = useTranslation("payment");
  const [open, setOpen] = React.useState(true);

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

  const view = window.Pelcro.helpers.getURLParameter("view");

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

    if (product && plan && view == "offer") {
      return switchView("offer");
    }

    if (product && plan) {
      return switchView("plan-select");
    }
  };

  return (
    <Modal
      id="pelcro-subscription-create-modal"
      className="plc-profile-menu-width"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader
        hideCloseButton={false}
        title={product?.paywall?.subscribe_title ??
          window.Pelcro.paywall.read()?.subscribe_title}
        description={product?.paywall?.subscribe_subtitle ??
          window.Pelcro.paywall.read()?.subscribe_subtitle}
        showBackButton={showBackButton}
        handleBackButton={goBack}
        showTitleInLeft={false}
      />
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
