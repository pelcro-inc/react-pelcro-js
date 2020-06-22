import React from "react";
import { useTranslation } from "react-i18next";
import { AlertDanger, AlertSuccess } from "../../components";
import { AddressUpdateFirstName } from "./AddressUpdateFirstName";
import { AddressUpdateLastName } from "./AddressUpdateLastName";
import { AddressUpdateLine1 } from "./AddressUpdateLine1";
import { AddressUpdateCity } from "./AddressUpdateCity";
import { AddressUpdatePostalCode } from "./AddressUpdatePostalCode";
import { AddressUpdateSubmit } from "./AddressUpdateSubmit";
import { AddressUpdateContainer } from "./AddressUpdateContainer";
import { AddressUpdateCountrySelect } from "./AddressUpdateCountrySelect";
import { AddressUpdateStateSelect } from "./AddressUpdateStateSelect";

export const AddressUpdateView = props => {
  const { t } = useTranslation("address");
  return (
    <AddressUpdateContainer {...props}>
      <div className="pelcro-prefix-title-clock">
        <h4>{t("title")}</h4>
      </div>

      <AlertDanger name="address" />
      <AlertSuccess name="address" />

      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-first_name"
            >
              {t("labels.firstName")} *
            </label>
            <AddressUpdateFirstName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="first-name"
              id="pelcro-input-first_name"
              placeholder={t("labels.firstName")}
            />
          </div>
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-last_name"
            >
              {t("labels.lastName")} *
            </label>
            <AddressUpdateLastName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="last-name"
              id="pelcro-input-last_name"
              placeholder={t("labels.lastName")}
            />
          </div>
        </div>
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-line1"
            >
              {t("labels.address")} *
            </label>
            <AddressUpdateLine1
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="street-address"
              id="pelcro-input-line1"
              placeholder={t("labels.address")}
            />
          </div>
        </div>
        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-postal_code"
            >
              {t("labels.code")} *
            </label>
            <AddressUpdatePostalCode
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="postal-code"
              id="pelcro-input-postal_code"
              placeholder={t("labels.code")}
            />
          </div>
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-city"
            >
              {t("labels.city")} *
            </label>
            <AddressUpdateCity
              fieldName="city"
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="address-level2"
              id="pelcro-input-city"
              type="text"
              placeholder={t("labels.city")}
            />
          </div>
        </div>
        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-country"
            >
              {t("labels.country")} *
            </label>
            <AddressUpdateCountrySelect
              className="pelcro-prefix-select pelcro-prefix-form-control"
              id="pelcro-input-country"
            />
          </div>
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-region"
            >
              {t("labels.region")} *
            </label>
            <AddressUpdateStateSelect className="pelcro-prefix-select pelcro-prefix-form-control" />
          </div>
        </div>
        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("labels.required")}
        </small>
        <AddressUpdateSubmit
          name={t("buttons.submit")}
          id="address-submit"
        ></AddressUpdateSubmit>
      </div>
    </AddressUpdateContainer>
  );
};
