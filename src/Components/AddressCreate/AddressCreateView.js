import React from "react";
import { useTranslation } from "react-i18next";
import ErrMessage from "../common/ErrMessage";
import { AddressFirstName } from "./AddressFirstName";
import { AddressLastName } from "./AddressLastName";
import { AddressTextInput } from "./AddressTextInput";
import { AddressCreateSubmit } from "./AddressCreateSubmit";
import { AddressCreateContainer } from "./AddressCreateContainer";
import { AddressCountrySelect } from "./AddressCountrySelect";
import { AddressStateSelect } from "./AddressStateSelect";

export const AddressCreateView = props => {
  const { t } = useTranslation("address");
  return (
    <AddressCreateContainer {...props}>
      <div className="pelcro-prefix-title-clock">
        <h4>{t("title")}</h4>
      </div>

      <ErrMessage name="address" />

      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-row">
          <div className="col-md-6">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-first_name"
            >
              {t("labels.firstName")} *
            </label>
            <AddressFirstName
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
            <AddressLastName
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="last-name"
              id="pelcro-input-last_name"
              placeholder={t("labels.lastName")}
            />
          </div>
        </div>
        <div className="pelcro-prefix-row">
          <div className="col-md-12">
            <label className="pelcro-prefix-label" htmlFor="pelcro-input-line1">
              {t("labels.address")} *
            </label>
            <AddressTextInput
              fieldName="line1"
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="street-address"
              id="pelcro-input-line1"
              type="text"
              placeholder={t("labels.address")}
            ></AddressTextInput>
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
            <AddressTextInput
              fieldName="postalCode"
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="postal-code"
              id="pelcro-input-postal_code"
              type="text"
              placeholder={t("labels.code")}
            ></AddressTextInput>
          </div>
          <div className="col-md-6">
            <label className="pelcro-prefix-label" htmlFor="pelcro-input-city">
              {t("labels.city")} *
            </label>
            <AddressTextInput
              fieldName="city"
              className="pelcro-prefix-input pelcro-prefix-form-control"
              autoComplete="address-level2"
              id="pelcro-input-city"
              type="text"
              placeholder={t("labels.city")}
            ></AddressTextInput>
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
            <AddressCountrySelect
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
            <AddressStateSelect className="pelcro-prefix-select pelcro-prefix-form-control" />
          </div>
        </div>
        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("labels.required")}
        </small>
        <AddressCreateSubmit
          text={t("buttons.submit")}
          id="address-submit"
        ></AddressCreateSubmit>
      </div>
    </AddressCreateContainer>
  );
};
