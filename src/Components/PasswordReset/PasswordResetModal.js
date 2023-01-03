import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
// import { PasswordResetView } from "./PasswordResetView";
const PasswordResetView = lazy(() =>
  import("./PasswordResetView").then((module) => {
    return { default: module.PasswordResetView };
  })
);

export const PasswordResetModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("passwordReset");

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-password-reset-modal"
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("title")}
          </h4>
          <p>{t("subtitle")}</p>
        </div>
      </ModalHeader>
      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <PasswordResetView {...otherProps} />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

PasswordResetModal.viewId = "password-reset";
