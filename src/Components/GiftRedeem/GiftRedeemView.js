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
      <div className="plc-mb-6 plc-text-center plc-text-gray-700 pelcro-title-wrapper">
        <h4 className="plc-text-2xl plc-font-semibold">
          {t("redeem.titles.firstTitle")}
        </h4>
        <p>{t("redeem.titles.secondTitle")}</p>
      </div>
      <form
        action="javascript:void(0);"
        className="plc-mt-2 pelcro-form"
      >
        <GiftRedeemContainer {...props}>
          <AlertWithContext />
          <div className="plc-flex plc-items-start">
            <GiftRedeemCode
              id="pelcro-input-gift-code"
              errorId="pelcro-input-gift-code-error"
              label={t("redeem.labels.code")}
              required
              autoFocus={true}
            />
          </div>
          <GiftRedeemSubmitButton
            role="submit"
            className="plc-mt-2 plc-w-full"
            id="pelcro-submit"
            name={t("redeem.buttons.redeem")}
          />
        </GiftRedeemContainer>
      </form>
    </div>
  );
};
