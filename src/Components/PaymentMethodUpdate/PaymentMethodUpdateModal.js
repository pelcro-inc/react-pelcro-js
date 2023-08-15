import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodUpdateView } from "./PaymentMethodUpdateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export const PaymentMethodUpdateModal = (props) => {
  const { t } = useTranslation("paymentMethod");

  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
  const onSuccess = (res) => {
    props.onSuccess?.(res);
    if (enableReactGA4) {
      ReactGA4.event("Updated payment card", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Updated payment card",
        nonInteraction: true
      });
    }
  };

  return (
    <Modal
      id="pelcro-payment-method-update-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("update.title")}
          </h4>
          <p className="plc-text-sm">{t("update.subtitle")}</p>
        </div>
      </ModalHeader>

      <ModalBody>
        <PaymentMethodUpdateView {...props} onSuccess={onSuccess} />
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PaymentMethodUpdateModal.viewId = "payment-method-update";
