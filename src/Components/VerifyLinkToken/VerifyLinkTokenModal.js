import React from "react";
import { useTranslation } from "react-i18next";
import { VerifyLinkTokenView } from "./VerifyLinkTokenView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { notify } from "../../SubComponents/Notification";
import { usePelcro } from "../../hooks/usePelcro";

export function VerifyLinkTokenModal({
  onDisplay,
  onClose,
  ...props
}) {
  const { t } = useTranslation("verifyLinkToken");
  const { resetView } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    resetView();
    notify.success(t("messages.success"));
  };

  return (
    <Modal
      id="pelcro-login-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader>
        <div className="plc-text-left plc-text-gray-900 pelcro-title-wrapper plc-flex-1 plc-flex plc-flex-col plc-justify-center">
          <h4 className="plc-text-xl plc-font-bold">
            {t("labels.title")}
          </h4>
        </div>
      </ModalHeader>

      <ModalBody>
        <VerifyLinkTokenView {...props} onSuccess={onSuccess} />
      </ModalBody>

      <ModalFooter></ModalFooter>
    </Modal>
  );
}

VerifyLinkTokenModal.viewId = "passwordless-login";
