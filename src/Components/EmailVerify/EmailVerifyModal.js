import React, { Suspense, lazy } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
// import { EmailVerifyView } from "./EmailVerifyView";
const EmailVerifyView = lazy(() =>
  import("./EmailVerifyView").then((module) => {
    return { default: module.EmailVerifyView };
  })
);

export const EmailVerifyModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("verifyEmail");

  return (
    <Modal
      onDisplay={onDisplay}
      onClose={onClose}
      id="pelcro-email-verify-modal"
    >
      <ModalHeader>
        <div className="plc-text-center plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-2xl plc-font-semibold">
            {t("labels.title")}
          </h4>
        </div>
      </ModalHeader>
      <ModalBody>
        <Suspense fallback={<p>Loading ...</p>}>
          <EmailVerifyView {...otherProps} />
        </Suspense>
      </ModalBody>
      <ModalFooter></ModalFooter>
    </Modal>
  );
};

EmailVerifyModal.viewId = "email-verify";
