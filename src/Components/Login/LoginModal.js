import React from "react";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";
import { LoginView } from "./LoginView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Link } from "../../SubComponents/Link";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *
 */
export function LoginModal({ setView, onClose, ...props }) {
  const { t } = useTranslation("login");
  const { switchView } = usePelcro();

  const onCreateAccountClick = () => {
    if (props?.onCreateAccountClick?.() === false) {
      return;
    }

    console.log("switched to select view");
    switchView("select");
  };

  const onForgotPassword = () => {
    switchView("password-forgot");
  };
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      id="login"
    >
      <ModalBody>
        <LoginView onForgotPassword={onForgotPassword} {...props} />
      </ModalBody>
      <ModalFooter>
        <div>
          {t("messages.dontHaveAccount") + " "}
          <Link
            id="pelcro-link-create-account"
            onClick={onCreateAccountClick}
          >
            {t("messages.createAccount")}
          </Link>
        </div>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

LoginModal.id = "login";
