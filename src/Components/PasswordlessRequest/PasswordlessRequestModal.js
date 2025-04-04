import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../ui/Modal";
import { PasswordlessRequestView } from "./PasswordlessRequestView";
import { notify } from "../../SubComponents/Notification";

export function PasswordlessRequestModal({ onDisplay, onClose, ...props }) {
  const { t } = useTranslation("passwordlessRequest");
  const { switchView } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    notify.success(t("messages.PasswordlessLoginSuccess"));
    handleAfterRequestLogic();
  };

  const handleAfterRequestLogic = () => {
    // Add any specific logic needed after passwordless request
    // Similar to how LoginModal handles post-login logic
    switchView("verify-link-token");
  };

  const onLoginClick = () => {
    switchView("login");
  };

  return (
    <Modal
      id="pelcro-passwordless-request-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalHeader
        hideCloseButton={false}
        title={t("title")}
        description={t('subtitle')}
      />

      <ModalBody>
        <PasswordlessRequestView {...props} onSuccess={onSuccess} />
      </ModalBody>

      <ModalFooter>
        <p className="plc-text-center plc-text-sm plc-text-gray-500 ">
          {t("messages.backToLogin") + " "}
          <Link
            onClick={onLoginClick}
            className="plc-font-medium plc-text-gray-900 plc-transition-colors plc-hover:underline"
          >
            {t("messages.loginHere")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
}

PasswordlessRequestModal.viewId = "passwordless-request";
