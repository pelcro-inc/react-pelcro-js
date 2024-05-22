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

  const goBack = () => {
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
          <button
            type="button"
            onClick={goBack}
            className="plc-absolute plc-w-6 plc-text-gray-500 focus:plc-text-black plc-z-max plc-top-1/2 plc-left-6 plc-transform plc--translate-y-1/2 plc-border-0 hover:plc-text-black hover:plc-shadow-none plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent"
          >
            <ArrowLeft />
          </button>
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
