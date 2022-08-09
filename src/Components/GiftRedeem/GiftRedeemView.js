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
