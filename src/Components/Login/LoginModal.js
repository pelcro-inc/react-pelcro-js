import React from "react";
import { useTranslation } from "react-i18next";
import Authorship from "../common/Authorship";
import { LoginView } from "./LoginView";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import { Link } from "../../SubComponents/Link";

export function LoginModal({ setView, onClose, ...otherProps }) {
  const { t } = useTranslation("login");

  const onCreateAccountClick = () => {
    setView("select");
  };

  const onForgotPassword = () => {
    setView("password-forgot");
  };
  return (
    <Modal id="pelcro-login-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
      />
      <ModalBody>
        <LoginView
          onForgotPassword={onForgotPassword}
          {...otherProps}
        />
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
