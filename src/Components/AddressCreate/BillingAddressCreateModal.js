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

export const BillingAddressCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const {
    switchView,
    // switchToPaymentView,
    // resetView,
    switchToCheckoutForm,
    flow
  } = usePelcro();
  const { t } = useTranslation("address");

  const onSuccess = (newAddressId) => {
    otherProps.onSuccess?.(newAddressId);

    switch (flow) {
      case "createPaymentSource":
        switchView("payment-method-create");
        break;

      case "deletePaymentSource":
        switchView("payment-method-delete");
        break;

      default:
        switchToCheckoutForm();
        break;
    }
  };

  // const onGiftRedemptionSuccess = () => {
  //   otherProps.onGiftRedemptionSuccess?.();
  //   switchView("subscription-success");
  // };

  // FIXME: implement me
  // const onMembershipAdressUpdateSuccess = () => {
  //   otherProps.onMembershipAdressUpdateSuccess?.();
  //   resetView();
  // };

  return (
    <Modal
      id="pelcro-address-create-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("titleBilling")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <AddressCreateView
          {...otherProps}
          type="billing"
          onSuccess={onSuccess}
          // onGiftRedemptionSuccess={onGiftRedemptionSuccess}
          // onMembershipAdressUpdateSuccess={
          //   onMembershipAdressUpdateSuccess
          // }
        />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

BillingAddressCreateModal.viewId = "billing-address-create";
