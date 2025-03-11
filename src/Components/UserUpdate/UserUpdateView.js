import React from "react";
import { useTranslation } from "react-i18next";
import { UserUpdateEmail } from "./UserUpdateEmail";
import { UserUpdateFirstName } from "./UserUpdateFirstName";
import { UserUpdateLastName } from "./UserUpdateLastName";
import { UserUpdatePhone } from "./UserUpdatePhone";
import { UserUpdateButton } from "./UserUpdateButton";
import { UserUpdateUsername } from "./UserUpdateUsername";
import { UserUpdateContainer } from "./UserUpdateContainer";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { UserUpdateProfilePic } from "./UserUpdateProfilePic";
import { UserUpdateTin } from "./UserUpdateTin";
import { UserUpdateDisplayName } from "./UserUpdateDisplayName";
import { UserUpdateDateOfBirth } from "./UserUpdateDateOfBirth";

export const UserUpdateView = (props) => {
  const { t } = useTranslation("userEdit");
  const supportsTap = Boolean(
    window.Pelcro.site.read()?.tap_gateway_settings
  );
  const showUsernameInput =
    window.Pelcro?.uiSettings?.enableLoginWithUsername;

  const showDateOfBirth =
    window.Pelcro?.uiSettings?.enableDateOfBirth;

  return (
    <div id="pelcro-user-update-view">
      <form
        action="javascript:void(0);"
        className="plc-space-y-6"
      >
        <UserUpdateContainer {...props}>
          <AlertWithContext />

          <div className="plc-flex plc-justify-center plc-mb-6 my-4">
            <UserUpdateProfilePic onClick={props.onPictureClick} />
          </div>

          <div className="plc-space-y-4 plc-w-full" >
            <div className="plc-relative plc-w-full">
              <UserUpdateEmail
                id="pelcro-input-email"
                errorId="pelcro-input-email-error"
                label={t("labels.email")}
                placeholder={t("labels.email")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm disabled:plc-bg-gray-100 disabled:plc-text-gray-500 disabled:plc-cursor-not-allowed"
              />
            </div>

            <div className="plc-grid plc-grid-cols-2 plc-gap-4">
              <UserUpdateFirstName
                autoComplete="first-name"
                id="pelcro-input-first-name"
                errorId="pelcro-input-first-name-error"
                label={t("labels.firstName")}
                placeholder={t("labels.firstName")}
                autoFocus={true}
                required={supportsTap}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
              <UserUpdateLastName
                autoComplete="last-name"
                id="pelcro-input-last-name"
                errorId="pelcro-input-last-name-error"
                label={t("labels.lastName")}
                placeholder={t("labels.lastName")}
                required={supportsTap}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <UserUpdateDisplayName
                id="pelcro-input-display-name"
                autoComplete="display-name"
                errorId="pelcro-input-display-name-error"
                label={t("labels.displayname")}
                placeholder={t("labels.displayname")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            {showUsernameInput && (
              <div className="plc-relative">
                <UserUpdateUsername
                  id="pelcro-input-user-name"
                  autoComplete="user-name"
                  errorId="pelcro-input-user-name-error"
                  label={t("labels.username")}
                  placeholder={t("labels.username")}
                  className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
                />
              </div>
            )}

            <div className="plc-relative">
              <UserUpdatePhone
                id="pelcro-input-phone"
                errorId="pelcro-input-phone-error"
                label={t("labels.phone")}
                placeholder={t("labels.phone")}
                required={supportsTap}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            {showDateOfBirth && (
              <div className="plc-relative">
                <UserUpdateDateOfBirth
                  id="pelcro-input-date-of-birth"
                  autoComplete="date-of-birth"
                  errorId="pelcro-input-date-of-birth-error"
                  label={t("labels.dateOfBirth")}
                  placeholder={t("labels.dateOfBirth")}
                  className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
                />
              </div>
            )}

            <UserUpdateButton
              role="submit"
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all hover:plc-bg-gray-800 disabled:plc-bg-gray-300 disabled:plc-cursor-not-allowed"
              name={t("labels.submit")}
              id="pelcro-submit"
            />
          </div>
        </UserUpdateContainer>
      </form>
    </div>
  );
};
