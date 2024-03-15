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

export const BillingAddressSelectModal = ({
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

  const onSuccess = (selectedBillingAddressId) => {
    otherProps.onSuccess?.(selectedBillingAddressId);

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

  const onAddNewAddress = () => {
    switchView("billing-address-create");
  };

  // const onGiftRedemptionSuccess = () => {
  //   otherProps.onGiftRedemptionSuccess?.();
  //   switchView("subscription-success");
  // };

  // // FIXME: implement me
  // const onMembershipAdressUpdateSuccess = () => {
  //   otherProps.onMembershipAdressUpdateSuccess?.();
  //   resetView();
  // };

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-address-select-modal"
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
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

BillingAddressSelectModal.viewId = "billing-address-select";
