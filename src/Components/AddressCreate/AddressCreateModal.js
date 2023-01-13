import React from "react";
import { useTranslation } from "react-i18next";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
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
    giftRecipient
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

  return (
    <Modal
      id="pelcro-address-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4>{giftRecipient ? t("titleGifting") : t("title")}</h4>
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
