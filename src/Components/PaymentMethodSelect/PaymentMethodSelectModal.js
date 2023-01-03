import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
// import { PaymentMethodSelectView } from "./PaymentMethodSelectView";
const PaymentMethodSelectView = lazy(() =>
  import("./PaymentMethodSelectView").then((module) => {
    return { default: module.PaymentMethodSelectView };
  })
);

export const PaymentMethodSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchToCheckoutForm, set } = usePelcro();
  const { t } = useTranslation("paymentMethod");

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
        <Suspense fallback={<p>Loading ...</p>}>
          <PaymentMethodSelectView
            onAddNewPaymentMethod={onAddNewPaymentMethod}
            {...otherProps}
            onSuccess={onSuccess}
          />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PaymentMethodSelectModal.viewId = "payment-method-select";
