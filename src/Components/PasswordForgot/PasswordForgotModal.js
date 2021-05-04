import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordForgotView } from "./PasswordForgotView";

export const PasswordForgotModal = ({
  onClose,
  setView,
  hideHeaderLogo,
  ...otherProps
}) => {
  const { t } = useTranslation("passwordForgot");
  return (
    <Modal
      hideCloseButton={!window.Pelcro.paywall.displayCloseButton()}
      onClose={onClose}
      hideHeaderLogo={hideHeaderLogo}
      id="pelcro-password-forgot-modal"
    >
      <ModalBody>
        <PasswordForgotView {...otherProps} />
      </ModalBody>
      <ModalFooter>
        <div>
          {t("messages.alreadyHaveAccount") + " "}
          <Link
            id="pelcro-link-login"
            onClick={() => setView("login")}
          >
            {t("messages.loginHere")}
          </Link>
        </div>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
};
