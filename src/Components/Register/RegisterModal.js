// Register view.
// Sign up form. It is displayed after the plan is selected (after Select view) if user is not authenticated.

import React from "react";
import { useTranslation } from "react-i18next";
import ErrMessage from "../common/ErrMessage";
import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { RegisterView } from "./RegisterView";

export function RegisterModal({
  onSuccess,
  setView,
  resetView,
  product,
  ...otherProps
}) {
  const { t } = useTranslation("register");

  const displayLoginView = () => {
    setView("login");
  };

  const displaySelectView = () => {
    setView("select");
  };

  const title = product?.paywall?.register_title ?? t("title");
  const subtitle =
    product?.paywall?.register_subtitle ?? t("subtitle");

  return (
    <div className="pelcro-prefix-view">
      <div
        className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
        id="pelcro-view-register"
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
      >
        <div className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered">
          <div
            className="pelcro-prefix-modal-content"
            role="document"
          >
            <Header
              closeButton={window.Pelcro.paywall.displayCloseButton()}
              resetView={resetView}
              site={window.Pelcro.site.read()}
            ></Header>
            <div className="pelcro-prefix-modal-body">
              <div className="pelcro-prefix-title-block">
                <h4>{title}</h4>
                <p>{subtitle}</p>
              </div>

              <ErrMessage name="register" />

              <RegisterView onSuccess={onSuccess} {...otherProps} />

              <div className="pelcro-prefix-modal-footer">
                <small>
                  {t("messages.alreadyHaveAccount") + " "}
                  <button
                    className="pelcro-prefix-link"
                    onClick={displayLoginView}
                  >
                    {t("messages.loginHere")}
                  </button>
                  {" " + t("messages.selectPlan")}
                  <button
                    className="pelcro-prefix-link"
                    onClick={displaySelectView}
                  >
                    {t("messages.here")}
                  </button>
                </small>
                <Authorship></Authorship>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
