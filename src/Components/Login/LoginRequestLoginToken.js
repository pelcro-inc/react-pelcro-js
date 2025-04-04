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
      className="plc-group plc-flex plc-items-center plc-justify-center plc-gap-2 plc-rounded-lg plc-border plc-border-gray-200 plc-bg-white plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-gray-700 plc-transition-colors hover:plc-bg-gray-50 active:plc-bg-gray-100">
      <PasswordlessLogoIcon
        className={`plc-h-6 plc-w-6 plc-mt-1" ${iconClassName}`}
      />
      <p
        className={`plc-h-5 plc-w-5" ${labelClassName}`}
      >
        {name ?? t("title")}
      </p>
    </button>
  );
};
