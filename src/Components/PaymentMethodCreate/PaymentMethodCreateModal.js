import React from "react";
import { useTranslation } from "react-i18next";
import { PaymentMethodCreateView } from "./PaymentMethodCreateView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import ReactGA from "react-ga";
import ReactGA4 from "react-ga4";

export const PaymentMethodCreateModal = (props) => {
  const [t] = useTranslation("paymentMethod");
  const enableReactGA4 = window?.Pelcro?.uiSettings?.enableReactGA4;
  const onSuccess = (res) => {
    props.onSuccess?.(res);
    if (enableReactGA4) {
      ReactGA4.event("Created payment card", {
        nonInteraction: true
      });
    } else {
      ReactGA?.event?.({
        category: "ACTIONS",
        action: "Created payment card",
        nonInteraction: true
      });
    }
  };

  return (
    <Modal
      id="pelcro-payment-method-create-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("create.title")}
          </h4>
          <p className="plc-text-sm">{t("create.subtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <PaymentMethodCreateView {...props} onSuccess={onSuccess} />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PaymentMethodCreateModal.viewId = "payment-method-create";
