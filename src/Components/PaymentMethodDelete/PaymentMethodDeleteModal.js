import React from "react";
import { PaymentMethodDeleteView } from "./PaymentMethodDeleteView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";
import { usePelcro, notify } from "../../components";
import { useTranslation } from "react-i18next";

export const PaymentMethodDeleteModal = (props) => {
  const { t } = useTranslation("paymentMethod");
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
  const { resetView } = usePelcro();
  const onSuccess = (res) => {
    props.onSuccess?.(res);
    if (enableReactGA4) {
      ReactGA4.event("Delete payment card", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Delete payment card",
        nonInteraction: true
      });
    }
    notify.success(t("delete.paymentMethodReplaced"));
    resetView();
  };

  return (
    <Modal
      id="pelcro-payment-method-delete-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("delete.title")}
          </h4>
          <p className="plc-text-sm">{t("delete.subtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <PaymentMethodDeleteView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PaymentMethodDeleteModal.viewId = "payment-method-delete";
