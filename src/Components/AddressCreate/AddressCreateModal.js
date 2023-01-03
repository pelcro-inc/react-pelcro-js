import React, { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { usePelcro } from "../../hooks/usePelcro";
// import { AddressCreateView } from "./AddressCreateView";
const AddressCreateView = lazy(() =>
  import("./AddressCreateView").then((module) => {
    return { default: module.AddressCreateView };
  })
);

export const AddressCreateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { switchView, switchToPaymentView, resetView } = usePelcro();
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
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("title")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <AddressCreateView
            {...otherProps}
            onSuccess={onSuccess}
            onGiftRedemptionSuccess={onGiftRedemptionSuccess}
            onMembershipAdressUpdateSuccess={
              onMembershipAdressUpdateSuccess
            }
          />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

AddressCreateModal.viewId = "address-create";
