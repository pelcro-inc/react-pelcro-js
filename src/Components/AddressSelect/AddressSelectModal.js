import React from "react";
import { useTranslation } from "react-i18next";
import { AddressSelectView } from "./AddressSelectView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const AddressSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView, switchToPaymentView, resetView } = usePelcro();
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

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-address-select-modal"
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("selectAddressTitle")}
          </h4>
          <p>{t("selectAddressSubtitle")}</p>
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
