import React from "react";
import { useTranslation } from "react-i18next";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
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
    <Modal id="pelcro-address-create-modal" onDisplay={onDisplay}>
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

          <h4 className="plc-text-xl plc-font-bold">
            {giftRecipient ? t("titleGifting") : t("title")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <AddressCreateView
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRedemptionSuccess={onGiftRedemptionSuccess}
          onMembershipAdressUpdateSuccess={
            onMembershipAdressUpdateSuccess
          }
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

AddressCreateModal.viewId = "address-create";
