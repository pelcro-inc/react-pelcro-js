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
import { PasswordForgotView } from "./PasswordForgotView";

export function PasswordForgotModal({ onDisplay, onClose, ...props }) {
  const { t } = useTranslation("passwordForgot");
  const { switchView } = usePelcro();
  const [open, setOpen] = React.useState(true);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalHeader
        hideCloseButton={false}
        title={t("title")}
        description={t("subtitle")}
      />

      <ModalBody>
        <PasswordForgotView {...props} />
      </ModalBody>

      <ModalFooter>
        <p className="plc-text-center plc-text-sm plc-text-gray-500 plc-mt-8">
          {t("messages.alreadyHaveAccount") + " "}
          <Link
            onClick={() => switchView("login")}
            className="plc-font-medium plc-text-gray-900 plc-transition-colors hover:plc-underline"
          >
            {t("messages.loginHere")}
          </Link>
        </p>
      </ModalFooter>
    </Modal>
  );
}

PasswordForgotModal.viewId = "password-forgot";
