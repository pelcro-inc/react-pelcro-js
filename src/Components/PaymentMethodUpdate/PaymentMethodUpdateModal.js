import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import ReactGA from "react-ga";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
// import { PaymentMethodUpdateView } from "./PaymentMethodUpdateView";
const PaymentMethodUpdateView = lazy(() =>
  import("./PaymentMethodUpdateView").then((module) => {
    return { default: module.PaymentMethodUpdateView };
  })
);

export const PaymentMethodUpdateModal = (props) => {
  const { t } = useTranslation("paymentMethod");

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    ReactGA?.event?.({
      category: "ACTIONS",
      action: "Updated payment card",
      nonInteraction: true
    });
  };

  return (
    <Modal
      id="pelcro-payment-method-update-modal"
      onDisplay={props.onDisplay}
      onClose={props.onClose}
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold ">
            {t("update.title")}
          </h4>
          <p>{t("update.subtitle")}</p>
        </div>
      </ModalHeader>

      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <PaymentMethodUpdateView {...props} onSuccess={onSuccess} />
        </Suspense>
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PaymentMethodUpdateModal.viewId = "payment-method-update";
