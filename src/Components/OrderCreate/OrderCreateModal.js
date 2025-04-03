import React from "react";
import { useTranslation } from "react-i18next";
import { OrderCreateView } from "./OrderCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import { usePelcro } from "../../hooks/usePelcro";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";

export function OrderCreateModal({
  onDisplay,
  onClose,
  showExternalPaymentMethods = false,
  ...otherProps
}) {
  const { switchView, order } = usePelcro();
  const { t } = useTranslation("payment");
  const [open, setOpen] = React.useState(true);

  const onSuccess = () => {
    otherProps.onSuccess?.();
    return switchView("order-confirm");
  };

  const showBackButton = Boolean(order);

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
    if (order && isUserHasPaymentMethod) {
      return switchView("payment-method-select");
    }

    if (order && isUserHasAddress) {
      return switchView("address-select");
    }

    if (order) {
      return switchView("cart");
    }
  };

  return (
    <Modal
      id="pelcro-order-create-modal"
      className="plc-max-w-7xl"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("labels.checkout.title")}
        showBackButton={showBackButton}
        handleBackButton={goBack}
        showTitleInLeft={false}
      />
      <ModalBody>
        <OrderCreateView
          {...otherProps}
          onSuccess={onSuccess}
          showExternalPaymentMethods={showExternalPaymentMethods}
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
}

OrderCreateModal.viewId = "order-create";
