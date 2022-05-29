import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./UserUpdateContainer";
import { Email } from "../../SubComponents/Email";
import { EmailConfirm } from "../../SubComponents/EmailConfirm";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { Button } from "../../SubComponents/Button";

export const UserUpdateEmail = (props) => {
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const { t } = useTranslation("userEdit");

  const handleShowEmailConfirm = () => {
    setShowEmailConfirm(true);
  };

  return (
    <div>
      <div className="plc-flex plc-items-start plc-relative">
        <Email
          disabled={!showEmailConfirm}
          store={store}
          label={t("labels.email")}
          {...props}
        />
        {showEmailConfirm || (
          <Button
            variant="icon"
            className="plc-absolute plc-rounded-none plc-text-gray-500 plc-w-10 plc-h-10 plc-top-6 plc-right-0 hover:plc-text-gray-900 hover:plc-bg-transparent"
            icon={<EditIcon />}
            id={"pelcro-user-update-picture-button"}
            onClick={handleShowEmailConfirm}
          />
        )}
      </div>

      {showEmailConfirm && (
        <div className="plc-flex plc-items-start">
          <EmailConfirm
            store={store}
            label={t("labels.emailConfirm")}
            {...props}
          />
        </div>
      )}
    </div>
  );
};
