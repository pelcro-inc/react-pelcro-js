import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as SpinnerIcon } from "../../assets/spinner.svg";

export const BankAuthenticationSuccess = () => {
  const { t } = useTranslation("checkoutForm");

  return (
    <div className="plc-absolute plc-inset-0 plc-flex-col plc-items-center plc-justify-center plc-hidden plc-text-lg plc-bg-white plc-z-max plc-text-primary-500 card-authentication-success-container">
      {t("messages.bankAuthenticationSuccess")}
      <SpinnerIcon className="plc-w-10 plc-h-10 plc-mt-5 plc-animate-spin" />
    </div>
  );
};
