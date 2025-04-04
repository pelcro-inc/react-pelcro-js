import React from "react";
import { useTranslation } from "react-i18next";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const AddressCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const {
    switchView,
    switchToPaymentView,
    resetView,
    giftRecipient,
    product,
    plan,
    order
  } = usePelcro();
  const { t } = useTranslation("address");

  const onSuccess = (newAddressId) => {
    otherProps.onSuccess?.(newAddressId);

    switchToPaymentView();
  };

  const onGiftRedemptionSuccess = () => {
    otherProps.onGiftRedemptionSuccess?.();
    switchView("subscription-success");
  };

  // FIXME: implement me
  const onMembershipAdressUpdateSuccess = () => {
    otherProps.onMembershipAdressUpdateSuccess?.();
    resetView();
  };

  const showBackButton = Boolean(
    (product && plan && !giftRecipient) || order
  );

  const userHasAddress = () => {
    const addresses = window.Pelcro.user.read()?.addresses ?? [];
    return addresses.length > 0;
  };

  const view = window.Pelcro.helpers.getURLParameter("view");

  const isUserHasAddress = userHasAddress();

  const goBack = () => {
    if (product && plan && isUserHasAddress) {
      return switchView("address-select");
    }
    if (order && isUserHasAddress) {
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
      id="pelcro-address-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
      showBackButton={showBackButton}
      handleBackButton={goBack}
      showTitleInLeft={true}
    >
      <ModalHeader
        hideCloseButton={false}
        title={giftRecipient ? t("titleGifting") : t("title")}
        showTitleInLeft={true}
        // description={t("subtitle")}
      />
      <ModalBody className="plc-mt-4">
        <AddressCreateView
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRedemptionSuccess={onGiftRedemptionSuccess}
          onMembershipAdressUpdateSuccess={onMembershipAdressUpdateSuccess}
        />
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

AddressCreateModal.viewId = "address-create";
