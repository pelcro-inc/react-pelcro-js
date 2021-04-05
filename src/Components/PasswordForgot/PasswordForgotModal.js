import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../../SubComponents/Link";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { PasswordForgotView } from "./PasswordForgotView";

export const PasswordForgotModal = ({
  onClose,
  setView,
  ...otherProps
}) => {
  const { t } = useTranslation("passwordForgot");
  return (
    <Modal id="pelcro-password-forgot-modal">
      <ModalHeader hideCloseButton={false} onClose={onClose} />
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
