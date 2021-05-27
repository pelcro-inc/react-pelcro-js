import React from "react";
import { useTranslation } from "react-i18next";
import { usePelcro } from "../../hooks/usePelcro";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
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
      <ModalBody>
        <PasswordForgotView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <div>
          {t("messages.alreadyHaveAccount") + " "}
          <Link
            id="pelcro-pelcro-link-login"
            onClick={() => switchView("login")}
          >
            {t("messages.loginHere")}
          </Link>
        </div>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};

PasswordForgotModal.viewId = "password-forgot";
