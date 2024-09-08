import React, { useEffect } from "react";
import Authorship from "../common/Authorship";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
import { displayAddressCreate } from "../../utils/events";

export const AddressCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const {
    switchView,
    switchToPaymentView,
    resetView,
    product,
    plan
  } = usePelcro();

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

  useEffect(() => {
    document.dispatchEvent(displayAddressCreate({ product, plan }));
  }, []);

  return (
    <Modal
      id="pelcro-address-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
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
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

AddressCreateModal.viewId = "address-create";
