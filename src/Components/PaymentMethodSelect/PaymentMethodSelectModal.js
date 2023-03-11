import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodSelectView } from "./PaymentMethodSelectView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentMethodSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("paymentMethod");
  const { switchToCheckoutForm, set, plan, order } = usePelcro();

  const skipPayment =
    window.Pelcro?.uiSettings?.skipPaymentForFreePlans;

  useEffect(() => {
    if (skipPayment && (plan?.amount === 0 || order?.price === 0)) {
      switchToCheckoutForm();
    }
  }, []);

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
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("select.title")}
          </h4>
          <p>{t("select.subtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <PaymentMethodSelectView
          onAddNewPaymentMethod={onAddNewPaymentMethod}
          {...otherProps}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PaymentMethodSelectModal.viewId = "payment-method-select";
