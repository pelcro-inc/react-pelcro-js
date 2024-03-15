import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { AddressUpdateView } from "./AddressUpdateView";

export const BillingAddressUpdateModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("address");

  return (
    <Modal
      id="pelcro-address-update-modal"
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
        <AddressUpdateView type="billing" {...otherProps} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

BillingAddressUpdateModal.viewId = "billing-address-edit";
