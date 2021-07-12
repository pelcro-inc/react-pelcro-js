import React from "react";
import Authorship from "../common/Authorship";
import { PaymentMethodSelectView } from "./PaymentMethodSelectView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentMethodSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView, resetView, switchToPaymentView } = usePelcro();

  const onSuccess = (selectedPaymentMethodId) => {
    otherProps.onSuccess?.(selectedPaymentMethodId);

    switchToPaymentView();
  };

  const onGiftRedemptionSuccess = () => {
    otherProps.onGiftRedemptionSuccess?.();
    resetView();
  };

  const onAddNewPaymentMethod = () => {
    switchView("subscription-create");
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-payment-method-select-modal"
    >
      <ModalBody>
        <PaymentMethodSelectView
          onAddNewPaymentMethod={onAddNewPaymentMethod}
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRedemptionSuccess={onGiftRedemptionSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PaymentMethodSelectModal.viewId = "payment-method-select";
