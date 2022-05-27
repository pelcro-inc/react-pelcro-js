import React from "react";
import { useTranslation } from "react-i18next";
import { VerifyLinkTokenView } from "./VerifyLinkTokenView";
import {
  Modal,
  ModalBody,
  ModalFooter
} from "../../SubComponents/Modal";
import Authorship from "../common/Authorship";
import { usePelcro } from "../../hooks/usePelcro";

/**
 *
 */
export function VerifyLinkTokenModal({ onDisplay, onClose, ...props }) {
  const { t } = useTranslation("verifyLinkToken");
  const { resetView } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    resetView();
  };

  return (
    <Modal
      id="pelcro-login-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <VerifyLinkTokenView
          {...props}
          onSuccess={onSuccess}
        />
      </ModalBody>
      <ModalFooter>
        <Authorship />
      </ModalFooter>
    </Modal>
  );
}

VerifyLinkTokenModal.viewId = "passwordless-login";
