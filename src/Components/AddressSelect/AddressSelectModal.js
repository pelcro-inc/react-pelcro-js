import React from "react";
import { useTranslation } from "react-i18next";
import { AddressSelectView } from "./AddressSelectView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
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

  const goBack = () => {
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
            {t("selectAddressTitle")}
          </h4>
          <p className="plc-text-sm">{t("selectAddressSubtitle")}</p>
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
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

AddressSelectModal.viewId = "address-select";
