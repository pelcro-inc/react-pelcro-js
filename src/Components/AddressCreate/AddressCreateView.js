import React from "react";
import { useTranslation } from "react-i18next";
import { AddressCreateFirstName } from "./AddressCreateFirstName";
import { AddressCreateLastName } from "./AddressCreateLastName";
import { AddressCreateLine1 } from "./AddressCreateLine1";
import { AddressCreateCity } from "./AddressCreateCity";
import { AddressCreatePostalCode } from "./AddressCreatePostalCode";
import { AddressCreateSubmit } from "./AddressCreateSubmit";
import { AddressCreateContainer } from "./AddressCreateContainer";
import { AddressCreateCountrySelect } from "./AddressCreateCountrySelect";
import { AddressCreateStateSelect } from "./AddressCreateStateSelect";
import { AddressCreateSetDefault } from "./AddressCreateSetDefault";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";
import { AddressCreatePhone } from "./AddressCreatePhone";

export const AddressCreateView = (props) => {
  const { t } = useTranslation("address");

  return (
    <div id="pelcro-address-create-view">
      <form
        action="javascript:void(0);"
        className="plc-space-y-4"
      >
        <AddressCreateContainer {...props}>
          <AlertWithContext />

          <div className="plc-space-y-4">
            <div className="plc-grid plc-grid-cols-2 plc-gap-4">
              <AddressCreateFirstName
                id="pelcro-input-first-name"
                errorId="pelcro-input-first-name-error"
                label={t("labels.firstName")}
                autoFocus={true}
                placeholder={t("labels.firstName")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
              <AddressCreateLastName
                id="pelcro-input-last-name"
                errorId="pelcro-input-last-name-error"
                label={t("labels.lastName")}
                placeholder={t("labels.lastName")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <AddressCreateLine1
                id="pelcro-input-line1"
                errorId="pelcro-input-line1-error"
                required
                label={t("labels.address")}
                placeholder={t("labels.address")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-grid plc-grid-cols-2 plc-gap-4">
              <AddressCreateCountrySelect
                id="pelcro-input-country"
                errorId="pelcro-input-country-error"
                label={t("labels.country")}
                placeholder={t("labels.country")}
                showLabel={false}
                required
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
              <AddressCreateCity
                id="pelcro-input-city"
                errorId="pelcro-input-city-error"
                label={t("labels.city")}
                placeholder={t("labels.city")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-grid plc-grid-cols-2 plc-gap-4">
              <AddressCreateStateSelect
                label={t("labels.region")}
                placeholder={t("labels.region")}
                showLabel={false}
                id="pelcro-input-state"
                errorId="pelcro-input-state-error"
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
              <AddressCreatePostalCode
                id="pelcro-input-postal-code"
                errorId="pelcro-input-postal-code-error"
                label={t("labels.code")}
                placeholder={t("labels.code")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-relative">
              <AddressCreatePhone
                id="pelcro-input-phone"
                errorId="pelcro-input-phone-error"
                label={t("labels.phone")}
                placeholder={t("labels.phone")}
                className="plc-w-full plc-rounded-lg plc-border plc-border-gray-200 plc-bg-gray-50/30 plc-px-4 plc-py-3 plc-text-sm plc-text-gray-800 plc-outline-none plc-transition-all plc-placeholder:text-gray-400 plc-focus:border-gray-800 plc-focus:border plc-focus:bg-white plc-focus:shadow-sm"
              />
            </div>

            <div className="plc-flex plc-items-center plc-space-x-2">
              <AddressCreateSetDefault
                id="pelcro-input-is-default"
                label={t("labels.isDefault")}
                placeholder={t("labels.isDefault")}
              />
            </div>

            <AddressCreateSubmit
              role="submit"
              id="pelcro-submit"
              name={t("buttons.submit")}
              className="plc-relative plc-w-full plc-rounded-lg plc-bg-gray-900 plc-px-4 plc-py-3 plc-text-sm plc-font-medium plc-text-white plc-transition-all hover:plc-bg-gray-800 disabled:plc-bg-gray-300 disabled:plc-cursor-not-allowed"
            />
          </div>
        </AddressCreateContainer>
      </form>
    </div>
  );
};
