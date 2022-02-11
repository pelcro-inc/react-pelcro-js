import React from "react";
import { useTranslation } from "react-i18next";
import { EmailVerifyContainer } from "./EmailVerifyContainer";
import { EmailVerifyResendButton } from "./EmailVerifyResendButton";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { ReactComponent as EmailIcon } from "../../assets/email-verify.svg";

export const EmailVerifyView = (props) => {
  const { t } = useTranslation("verifyEmail");

  return (
    <div id="pelcro-email-verify-view">
      <div className="plc-mb-6 plc-text-center plc-text-gray-900 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("labels.title")}
        </h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <EmailVerifyContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-flex-col plc-items-center plc-justify-center plc-mt-4">
            <EmailIcon className="plc-w-32 plc-h-32" />
            <p className="plc-mb-1 plc-text-gray-900">
              {t("labels.instructions")}{" "}
              <span className="plc-font-bold">
                {window.Pelcro.user.read()?.email}
              </span>
            </p>
          </div>
          <EmailVerifyResendButton
            role="submit"
            className="plc-mt-4 plc-w-full"
            name={t("labels.resend")}
            id="pelcro-submit"
          />
        </EmailVerifyContainer>
      </form>
    </div>
  );
};
