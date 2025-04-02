import React from "react";
import { useTranslation } from "react-i18next";
import { AddressCreateView } from "./AddressCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../Components/ui/Modal";
import { ReactComponent as ArrowLeft } from "../../assets/arrow-left.svg";
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

  const userHasBillingAddress = () => {
    const billingAddresses =
      window.Pelcro.user
        .read()
        ?.addresses.filter((address) => address.type == "billing") ??
      [];
    return billingAddresses.length > 0;
  };

  const isUserHasBillingAddress = userHasBillingAddress();

  const goBack = () => {
    if (isUserHasBillingAddress) {
      return switchView("billing-address-select");
    }

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
      className="pelcro-modal-wrapper"
    >
      <ModalHeader className="pelcro-modal-header">
        <div className="plc-flex plc-items-center plc-justify-between plc-w-full">
          <button
            type="button"
            onClick={goBack}
            className="plc-flex plc-items-center plc-justify-center plc-p-2 plc-text-gray-500 hover:plc-text-black focus:plc-outline-none"
          >
            <ArrowLeft className="plc-w-5 plc-h-5" />
          </button>
          <h4 className="plc-text-xl plc-font-semibold plc-text-center plc-flex-1">
            {t("titleBilling")}
          </h4>
          <div className="plc-w-8"></div>
        </div>
      </ModalHeader>
      <ModalBody className="plc-pt-6">
        <AddressCreateView
          {...otherProps}
          type="billing"
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter className="pelcro-modal-footer ">
        {/* You can add footer content here if needed */}
      </ModalFooter>
    </Modal>
  );
};

BillingAddressCreateModal.viewId = "billing-address-create";
