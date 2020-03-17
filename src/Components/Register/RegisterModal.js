// Register view.
// Sign up form. It is displayed after the plan is selected (after Select view) if user is not authenticated.

import React from "react";
import { useTranslation } from "react-i18next";
import ErrMessage from "../common/ErrMessage";
import Header from "../common/Header";
import Authorship from "../common/Authorship";
import { RegisterView } from "./RegisterView";

export function RegisterModal(props) {
  const { t } = useTranslation("register");

  const displayLoginView = () => {
    props.setView("login");
  };

  const displaySelectView = () => {
    props.setView("select");
  };

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
          <div className="pelcro-prefix-modal-content" role="document">
            <Header
              closeButton={window.Pelcro.paywall.displayCloseButton()}
              resetView={props.resetView}
              site={props.site}
            ></Header>
            <div className="pelcro-prefix-modal-body">
              <div className="pelcro-prefix-title-block">
                <h4>
                  {props.product
                    ? props.product.paywall.register_title
                    : t("title")}
                </h4>
                <p>
                  {props.product
                    ? props.product.paywall.register_subtitle
                    : t("subtitle")}
                </p>
              </div>

              <ErrMessage name="register" />

              <div className="pelcro-prefix-form">
                <div className="pelcro-prefix-row">
                  <RegisterView />

                  <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
                    * {t("labels.required")}
                  </small>

                  <p className="pelcro-prefix-small-text">
                    {t("messages.iAgree.iAgree") + " "}
                    <a
                      className="pelcro-prefix-link"
                      target="new"
                      href="https://www.pelcro.com/terms"
                    >
                      {t("messages.iAgree.terms")}
                    </a>{" "}
                    {t("messages.iAgree.and")}{" "}
                    <a
                      className="pelcro-prefix-link"
                      target="new"
                      href="https://www.pelcro.com/privacy"
                    >
                      {t("messages.iAgree.privacy")}
                    </a>
                  </p>
                </div>
              </div>
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
