import React from "react";
import Authorship from "../common/Authorship";
import { AddressSelectView } from "./AddressSelectView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";

export const AddressSelectModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView, switchToPaymentView } = usePelcro();

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
  };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-address-select-modal"
    >
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
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

AddressSelectModal.viewId = "address-select";
