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
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const AddressCreateView = (props) => {
  const { t } = useTranslation("address");
  return (
    <div id="pelcro-address-create-view">
      <div className="plc-mb-6 plc-text-2xl plc-font-semibold plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4>{t("title")}</h4>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <AddressCreateContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-space-x-3 plc-items-start">
            <AddressCreateFirstName
              id="pelcro-input-first-name"
              errorId="pelcro-input-first-name-error"
              required
              label={t("labels.firstName")}
              autoFocus={true}
            />
            <AddressCreateLastName
              id="pelcro-input-last-name"
              errorId="pelcro-input-last-name-error"
              required
              label={t("labels.lastName")}
            />
          </div>
          <div className="plc-flex plc-items-start">
            <AddressCreateLine1
              id="pelcro-input-line1"
              errorId="pelcro-input-line1-error"
              required
              label={t("labels.address")}
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-start">
            <AddressCreatePostalCode
              id="pelcro-input-postal-code"
              errorId="pelcro-input-postal-code-error"
              required
              label={t("labels.code")}
            />
            <AddressCreateCity
              id="pelcro-input-city"
              errorId="pelcro-input-city-error"
              label={t("labels.city")}
              required
            />
          </div>
          <div className="plc-flex plc-space-x-3 plc-items-start">
            <AddressCreateCountrySelect
              id="pelcro-input-country"
              errorId="pelcro-input-country-error"
              label={t("labels.country")}
              required
            />
            <AddressCreateStateSelect
              label={t("labels.region")}
              id="pelcro-input-state"
              errorId="pelcro-input-state-error"
              required
            />
          </div>
          <p className="pelcro-footnote">* {t("labels.required")}</p>
          <AddressCreateSubmit
            role="submit"
            className="plc-mt-2 plc-w-full"
            name={t("buttons.submit")}
            id="pelcro-submit"
          />
        </AddressCreateContainer>
      </form>
    </div>
  );
};
