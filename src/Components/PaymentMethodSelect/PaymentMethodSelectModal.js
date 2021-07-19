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
  const { switchToCheckoutForm, set } = usePelcro();

  const onSuccess = (selectedPaymentMethodId) => {
    otherProps.onSuccess?.(selectedPaymentMethodId);

    switchToCheckoutForm();
  };

  const onAddNewPaymentMethod = () => {
    set({ selectedPaymentMethodId: null });
    switchToCheckoutForm();
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
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PaymentMethodSelectModal.viewId = "payment-method-select";
