import React from "react";
import { useTranslation } from "react-i18next";
import { GiftRedeemContainer } from "./GiftRedeemContainer";
import { AlertDanger } from "../Alerts/AlertDanger";
import { GiftRedeemCode } from "./GiftRedeemCode";
import { GiftRedeemSubmitButton } from "./GiftRedeemSubmitButton";

export const GiftRedeemView = (props) => {
  const { t } = useTranslation("register");
  return (
    <GiftRedeemContainer {...props}>
      <div className="pelcro-prefix-title-block">
        <h4>{t("redeem.titles.firstTitle")}</h4>
        <p>{t("redeem.titles.secondTitle")}</p>
      </div>

      <AlertDanger name="redeem" />

      <div className="pelcro-prefix-form">
        <div className="pelcro-prefix-row">
          <div className="col-sm-12">
            <label
              className="pelcro-prefix-label"
              htmlFor="pelcro-input-gift_code"
            >
              {t("redeem.labels.code")} *
            </label>
            <GiftRedeemCode
              className="pelcro-prefix-input pelcro-prefix-form-control"
              id="pelcro-input-gift_code"
              placeholder={t("redeem.labels.codePlaceholder")}
            />
          </div>
        </div>

        <small className="pelcro-prefix-footnote pelcro-prefix-form-text">
          * {t("redeem.labels.required")}
        </small>

        <GiftRedeemSubmitButton
          className="pelcro-prefix-btn"
          name={t("redeem.buttons.redeem")}
        />
      </div>
    </GiftRedeemContainer>
  );
};
