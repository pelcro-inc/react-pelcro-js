// Login view.
// Login form which is shown only if the user is not authenticated.

import React from "react";
import { useTranslation } from "react-i18next";

import Header from "../common/Header";
import Authorship from "../common/Authorship";

import { LoginView } from "./LoginView";
import { Mody } from "../../SubComponents/new/Modal";

export function LoginModal({
  setView,
  resetView,
  onSuccess,
  ...otherProps
}) {
  const { t } = useTranslation("login");

  const onCreateAccountClick = () => {
    setView("select");
  };

  const onForgotPassword = () => {
    setView("password-forgot");
  };

  return (
    <Mody />
    // <div className="pelcro-prefix-view">
    //   <div
    //     className="pelcro-prefix-modal pelcro-prefix-fade pelcro-prefix-show"
    //     id="pelcro-view-login"
    //     tabIndex="-1"
    //     role="dialog"
    //     aria-hidden="true"
    //   >
    //     <div
    //       className="pelcro-prefix-modal-dialog pelcro-prefix-modal-dialog-centered"
    //       role="document"
    //     >
    //       <div className="pelcro-prefix-modal-content">
    //         <Header
    //           closeButton={window.Pelcro.paywall.displayCloseButton()}
    //           resetView={resetView}
    //           site={window.Pelcro.site.read()}
    //         ></Header>

    //         <LoginView onSuccess={onSuccess} {...otherProps} />

    //         <div className="pelcro-prefix-modal-footer">
    //           <small>
    //             {t("messages.dontHaveAccount") + " "}
    //             <button
    //               className="pelcro-prefix-link"
    //               id="pelcro-link-create-account"
    //               onClick={onCreateAccountClick}
    //             >
    //               {t("messages.createAccount")}
    //             </button>
    //             {" " + t("messages.forgotPassword") + " "}{" "}
    //             {t("messages.reset.click") + " "}
    //             <button
    //               className="pelcro-prefix-link"
    //               id="pelcro-link-forget-password"
    //               onClick={onForgotPassword}
    //             >
    //               {t("messages.reset.here")}
    //             </button>
    //             {" " + t("messages.reset.toReset")}
    //           </small>
    //           <Authorship></Authorship>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
