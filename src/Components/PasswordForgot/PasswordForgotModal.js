import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordForgotView } from "./PasswordForgotView";

export const PasswordForgotModal = ({
  onDisplay,
  onClose,
  ...otherProps
}) => {
  const { t } = useTranslation("passwordForgot");
  const { switchView } = usePelcro();

  return (
    <Modal
      id="pelcro-password-forgot-modal"
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
        <PasswordForgotView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <p className="plc-mb-9">
          <span className="plc-font-medium">
            {t("messages.alreadyHaveAccount") + " "}
          </span>
          <Link
            id="pelcro-link-login"
            onClick={() => switchView("login")}
          >
            {t("messages.loginHere")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
};

PasswordForgotModal.viewId = "password-forgot";
