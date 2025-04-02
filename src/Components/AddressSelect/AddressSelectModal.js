import React from "react";
import { useTranslation } from "react-i18next";
import { AddressSelectView } from "./AddressSelectView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const AddressSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const {
    switchView,
    switchToPaymentView,
    resetView,
    product,
    plan,
    giftRecipient,
    order
  } = usePelcro();
  const { t } = useTranslation("address");

  const onSuccess = (selectedAddressId) => {
    otherProps.onSuccess?.(selectedAddressId);

    switchToPaymentView();
  };

  const onGiftRedemptionSuccess = () => {
    otherProps.onGiftRedemptionSuccess?.();
    switchView("subscription-success");
  };

  const onAddNewAddress = () => {
    switchView("address-create");
  };

  // FIXME: implement me
  const onMembershipAdressUpdateSuccess = () => {
    otherProps.onMembershipAdressUpdateSuccess?.();
    resetView();
  };

  const showBackButton = Boolean(
    (product && plan && !giftRecipient) || order
  );

  const view = window.Pelcro.helpers.getURLParameter("view");

  const goBack = () => {
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
      id="pelcro-address-select-modal"
      className="plc-profile-menu-width"
    >
      <ModalHeader
        hideCloseButton={false}
        onCloseModal={onClose}
      >
        <div className="plc-relative plc-w-full">
          {showBackButton && (
            <button
              type="button"
              onClick={goBack}
              className="plc-absolute plc-w-6 plc-text-gray-500 focus:plc-text-black plc-z-max plc-top-1/2 plc-left-6 plc-transform plc--translate-y-1/2 plc-border-0 hover:plc-text-black hover:plc-shadow-none plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent"
            >
              <ArrowLeft />
            </button>
          )}
          <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-w-full">
            <h4 className="plc-text-2xl plc-font-bold plc-text-gray-800">
              {t("selectAddressTitle")}
            </h4>
            <p className="plc-mt-1 plc-text-gray-500 ">
              {t("selectAddressSubtitle")}
            </p>
          </div>
        </div>


      </ModalHeader>
      <ModalBody>
        <AddressSelectView
          onAddNewAddress={onAddNewAddress}
          {...otherProps}
          onSuccess={onSuccess}
          onGiftRedemptionSuccess={onGiftRedemptionSuccess}
          onMembershipAdressUpdateSuccess={
            onMembershipAdressUpdateSuccess
          }
        />
      </ModalBody>
      <ModalFooter />
    </Modal>
  );
};

AddressSelectModal.viewId = "address-select";
