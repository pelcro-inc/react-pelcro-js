import React from "react";
import { useTranslation } from "react-i18next";
import { OrderCreateView } from "./OrderCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";

export const OrderCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView, order } = usePelcro();
  const { t } = useTranslation("payment");

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
          <h4 className="plc-text-xl plc-font-bold plc-text-center">
            {t("labels.checkout.title")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <OrderCreateView {...otherProps} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

OrderCreateModal.viewId = "order-create";
