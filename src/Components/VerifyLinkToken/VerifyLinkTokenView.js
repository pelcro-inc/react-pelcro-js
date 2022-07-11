import React from "react";
import { useTranslation } from "react-i18next";
import { VerifyLinkTokenContainer } from "./VerifyLinkTokenContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { VerifyLinkTokenLoader } from "./VerifyLinkTokenLoader";

/**
 *
 */
export function VerifyLinkTokenView(props) {
  const { t } = useTranslation("verifyLinkToken");

  return (
    <div id="pelcro-login-view">
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4>{t("labels.title")}</h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <VerifyLinkTokenContainer {...props}>
          <VerifyLinkTokenLoader />
          <AlertWithContext />
        </VerifyLinkTokenContainer>
      </form>
    </div>
  );
}
