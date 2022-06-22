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
      onClick={() => onClick?.()}
      className={`plc-flex plc-items-center plc-mt-3 plc-mx-auto plc-justify-center plc-p-3 plc-space-x-3 plc-text-gray-700 plc-border plc-border-gray-200 plc-rounded-3xl hover:plc-bg-gray-200 pelcro-auth0-login ${className}`}
    >
      <PasswordlessLogoIcon
        className={`plc-w-6 plc-h-auto" ${iconClassName}`}
      />
      <p className={`${labelClassName}`}>
        {name ?? t("title")}
      </p>
    </button>
  );
};
