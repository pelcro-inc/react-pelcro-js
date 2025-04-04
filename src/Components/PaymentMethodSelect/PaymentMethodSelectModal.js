import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodSelectView } from "./PaymentMethodSelectView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
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

  const view = window.Pelcro.helpers.getURLParameter("view");

  const goBack = () => {
    if (
      ((product && plan && product.address_required) || order) &&
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

    if (order) {
      return switchView("cart");
    }
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-payment-method-select-modal"
      className="plc-profile-menu-width"
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("select.title")}
        description={t("select.subtitle")}
        handleBackButton={goBack}
        showBackButton={true}
      >
        
      </ModalHeader>

      <ModalBody>
        <PaymentMethodSelectView
          onAddNewPaymentMethod={onAddNewPaymentMethod}
          {...otherProps}
          onSuccess={onSuccess}
        />
      </ModalBody>

      <ModalFooter />
    </Modal>
  );
};

PaymentMethodSelectModal.viewId = "payment-method-select";
