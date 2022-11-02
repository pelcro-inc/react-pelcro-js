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
import { initPaywalls, initViewFromURL } from "../PelcroModalController/PelcroModalController.service";
import { getStableViewID } from "../../utils/utils";

/**
 *
 */
export function LoginModal({ onDisplay, onClose, ...props }) {
  const { t } = useTranslation("login");
  const { switchView, resetView, invoice } = usePelcro();

  const onSuccess = (res) => {
    props.onSuccess?.(res);
    
    if (window.Pelcro.paywall.isArticleRestricted()) {
      initPaywalls();
    }
    
    resetView();
    
    const viewFromURL = getStableViewID(
      window.Pelcro.helpers.getURLParameter("view")
    );

    if (viewFromURL === "invoice-details") {
      initViewFromURL();
    }
  };

  const onCreateAccountClick = () => {
    switchView("plan-select");
  };

  const onForgotPassword = () => {
    switchView("password-forgot");
  };

  const onPasswordlessRequest = () => {
    switchView("passwordless-request");
  };

  return (
    <Modal
      id="pelcro-login-modal"
      onDisplay={onDisplay}
      onClose={onClose}
    >
      <ModalBody>
        <LoginView
          onForgotPassword={onForgotPassword}
          {...props}
          onSuccess={onSuccess}
          onPasswordlessRequest={onPasswordlessRequest}
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

LoginModal.viewId = "login";
