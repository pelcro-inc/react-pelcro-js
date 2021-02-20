import React from "react";
import { useTranslation } from "react-i18next";
import { GiftRedeemContainer } from "./GiftRedeemContainer";
import { GiftRedeemCode } from "./GiftRedeemCode";
import { GiftRedeemSubmitButton } from "./GiftRedeemSubmitButton";
import { AlertWithContext } from "../../SubComponents/AlertWithContext";

export const GiftRedeemView = (props) => {
  const { t } = useTranslation("register");
  return (
    <div id="pelcro-gift-redeem-view">
      <div className="flex flex-col items-center text-lg font-semibold pelcro-title-container">
        <h4>{t("redeem.titles.firstTitle")}</h4>
        <p>{t("redeem.titles.secondTitle")}</p>
      </div>
      <div className="mt-2 pelcro-form">
        <GiftRedeemContainer {...props}>
          <AlertWithContext />
          <div className="flex gap-3">
            <GiftRedeemCode
              id="pelcro-input-gift-code"
              errorId="pelcro-input-gift-code-error"
              placeholder={t("redeem.labels.codePlaceholder")}
              label={t("redeem.labels.code")}
              required
            />
          </div>
          <GiftRedeemSubmitButton
            className="mt-2"
            id="pelcro-submit"
            name={t("redeem.buttons.redeem")}
          />
        </GiftRedeemContainer>
      </div>
    </div>
  );
};
