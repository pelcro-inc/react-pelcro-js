import React from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as PasswordlessLogoIcon } from "../../assets/email-verify.svg";

export const LoginRequestLoginToken = ({
  name,
  onClick,
  className = "",
  labelClassName = "",
  iconClassName = "",
  ...otherProps
}) => {
  const { t } = useTranslation("passwordlessRequest");

  return (
    <button
      type="button"
      onClick={() => onClick?.()}
      className={`plc-flex plc-items-center plc-justify-center plc-h-12 plc-px-5 plc-text-gray-700 plc-rounded-md pelcro-google-login plc-shadow-md_dark plc-flex-1 plc-bg-white hover:plc-bg-transparent ${className}`}
    >
      <PasswordlessLogoIcon
        className={`plc-w-6 plc-h-auto pelcro-paswordless-login-icon" ${iconClassName}`}
      />
      <p
        className={`pelcro-paswordless-login-label plc-ml-2 ${labelClassName}`}
      >
        {name ?? t("title")}
      </p>
    </button>
  );
};
