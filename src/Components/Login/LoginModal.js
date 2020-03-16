// Login view.
// Login form which is shown only if the user is not authenticated.

import React from "react";
import { useTranslation } from "react-i18next";
import { getErrorMessages } from "../common/Helpers";

import { showError } from "../../utils/showing-error";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { LoginView } from "./LoginView";

export function LoginModal({ setView, resetView, onSuccess }) {
  const { t } = useTranslation("messages");

  const showError = message => {
    showError(message, "pelcro-error-login");
  };

  const onCreateAccountClick = () => {
    setView("select");
  };

  const onForgotPassword = () => {
    setView("password-forgot");
  };

  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-login"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div
          className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
          role="document"
        >
          <div className="pelcro-prefix-modal-content">
            <Header
              closeButton={window.Pelcro.paywall.displayCloseButton()}
              resetView={resetView}
              site={window.Pelcro.site.read()}
            ></Header>

            <LoginView onSuccess={onSuccess} />

            <div className="pelcro-prefix-modal-footer">
              <small>
                {t("dontHaveAccount") + " "}
                <button
                  className="pelcro-prefix-link"
                  onClick={onCreateAccountClick}
                >
                  {t("createAccount")}
                </button>
                {" " + t("forgotPassword") + " "} {t("reset.click") + " "}
                <button
                  className="pelcro-prefix-link"
                  onClick={onForgotPassword}
                >
                  {t("reset.here")}
                </button>
                {" " + t("reset.toReset")}
              </small>
              <Authorship></Authorship>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
