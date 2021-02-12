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

  const site = window.Pelcro.site.read();

  return (
    <Modal id="pelcro-login-modal">
      <ModalHeader
        hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
        onClose={onClose}
        logo={site.logo}
        title={site.name}
      />
      <ModalBody>
        <LoginView {...otherProps} />
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
        <div>
          {t("messages.forgotPassword") + " "}
          {t("messages.reset.click") + " "}
          <Link
            id="pelcro-link-forget-password"
            onClick={onForgotPassword}
          >
            {t("messages.reset.here")}
          </Link>
          {" " + t("messages.reset.toReset")}
        </div>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}
