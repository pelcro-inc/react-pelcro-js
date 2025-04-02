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
      className="plc-profile-menu-width"
    >
      <ModalHeader
        hideCloseButton={false}

      >
        <div className="plc-relative plc-w-full">
          <button
            type="button"
            onClick={goBack}
            className="plc-absolute plc-w-6 plc-text-gray-500 focus:plc-text-black plc-z-max plc-top-0 plc-left-0 plc-border-0 hover:plc-text-black hover:plc-shadow-none plc-bg-transparent hover:plc-bg-transparent focus:plc-bg-transparent"
          >
            <ArrowLeft />
          </button>
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
          type="billing"
          onSuccess={onSuccess}
        // onGiftRedemptionSuccess={onGiftRedemptionSuccess}
        // onMembershipAdressUpdateSuccess={
        //   onMembershipAdressUpdateSuccess
        // }
        />
      </ModalBody>

      <ModalFooter />
    </Modal>
  );
};

BillingAddressSelectModal.viewId = "billing-address-select";
