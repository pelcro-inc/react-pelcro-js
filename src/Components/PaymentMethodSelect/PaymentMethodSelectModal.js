import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodSelectView } from "./PaymentMethodSelectView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentMethodSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("paymentMethod");
  const {
    switchToCheckoutForm,
    set,
    plan,
    order,
    product,
    switchView,
    giftRecipient
  } = usePelcro();

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

  const showBackButton = Boolean(
    (product && plan && !giftRecipient) || order
  );

  const userHasAddress = () => {
    const addresses = window.Pelcro.user.read()?.addresses ?? [];
    return addresses.length > 0;
  };

  const isUserHasAddress = userHasAddress();

  const goBack = () => {
    if (
      ((product && plan && product.address_required) || order) &&
      isUserHasAddress
    ) {
      return switchView("address-select");
    }

    if (product && plan) {
      return switchView("plan-select");
    }

    if (order) {
      return switchView("cart");
    }
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-payment-method-select-modal"
    >
      <ModalHeader>
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
            {t("select.title")}
          </h4>
          <p className="plc-text-sm">{t("select.subtitle")}</p>
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
