import React from "react";
import { useTranslation } from "react-i18next";
import { AddressUpdateFirstName } from "./AddressUpdateFirstName";
import { AddressUpdateLastName } from "./AddressUpdateLastName";
import { AddressUpdateLine1 } from "./AddressUpdateLine1";
import { AddressUpdateCity } from "./AddressUpdateCity";
import { AddressUpdatePostalCode } from "./AddressUpdatePostalCode";
import { AddressUpdateSubmit } from "./AddressUpdateSubmit";
import { AddressUpdateContainer } from "./AddressUpdateContainer";
import { AddressUpdateCountrySelect } from "./AddressUpdateCountrySelect";
import { AddressUpdateStateSelect } from "./AddressUpdateStateSelect";
import { AddressUpdateSetDefault } from "./AddressUpdateSetDefault";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { AddressUpdatePhone } from "./AddressUpdatePhone";

export const AddressUpdateView = (props) => {
  const { t } = useTranslation("address");

  return (
    <div id="pelcro-address-update-view">
      <form
        action="javascript:void(0);"
        className="plc-space-y-4"
      >
        <AddressUpdateContainer {...props}>
          <AlertWithContext />

          <div className="plc-space-y-4 plc-mt-2">
            <div className="plc-grid plc-grid-cols-2 plc-gap-4">
              <AddressUpdateFirstName
                id="pelcro-input-first-name"
                errorId="pelcro-input-first-name-error"
                label={t("labels.firstName")}
                required
                autoFocus={true}
                placeholder={t("labels.firstName")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
              <AddressUpdateLastName
                id="pelcro-input-last-name"
                errorId="pelcro-input-last-name-error"
                label={t("labels.lastName")}
                required
                placeholder={t("labels.lastName")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <AddressUpdateLine1
                id="pelcro-input-line1"
                errorId="pelcro-input-line1-error"
                label={t("labels.address")}
                required
                placeholder={t("labels.address")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-grid plc-grid-cols-2 plc-gap-4">
              <AddressUpdateCountrySelect
                id="pelcro-input-country"
                errorId="pelcro-input-country-error"
                label={t("labels.country")}
                required
                placeholder={t("labels.country")}
                showLabel={false}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
              <AddressUpdateCity
                id="pelcro-input-city"
                errorId="pelcro-input-city-error"
                label={t("labels.city")}
                required
                placeholder={t("labels.city")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-grid plc-grid-cols-2 plc-gap-4">
              <AddressUpdateStateSelect
                id="pelcro-input-state"
                errorId="pelcro-input-state-error"
                label={t("labels.region")}
                required
                placeholder={t("labels.region")}
                showLabel={false}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
              <AddressUpdatePostalCode
                id="pelcro-input-postal_code"
                errorId="pelcro-input-postal-code-error"
                label={t("labels.code")}
                required
                placeholder={t("labels.code")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <AddressUpdatePhone
                id="pelcro-input-phone"
                errorId="pelcro-input-phone-error"
                label={t("labels.phone")}
                placeholder={t("labels.phone")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-flex plc-items-center plc-space-x-2 plc-w-full">
              <AddressUpdateSetDefault
                id="pelcro-input-is-default"
                label={t("labels.isDefault")}
                placeholder={t("labels.isDefault")}
              />
            </div>

            <AddressUpdateSubmit
              role="submit"
              id="pelcro-submit"
              name={t("buttons.submit")}
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all hover:plc-bg-gray-800 disabled:plc-bg-gray-300 disabled:plc-cursor-not-allowed"
            />
          </div>
        </AddressUpdateContainer>
      </form>
    </div>
  );
};
