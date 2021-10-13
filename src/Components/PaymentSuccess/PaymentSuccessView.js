import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMark } from "../../assets/check-solid.svg";
import { ReactComponent as GiftIcon } from "../../assets/gift.svg";
import { usePelcro } from "../../hooks/usePelcro";

export const PaymentSuccessView = ({ onClose }) => {
  const { t } = useTranslation("success");
  const { successTitle, successContent, successIcon } =
    getSuccessContent(t);

  if (successTitle && successContent) {
    return (
      <div className="plc-flex plc-flex-col plc-items-center">
        {successIcon}
        <div className="plc-text-center plc-text-gray-900">
          <h4 className="plc-mb-4 plc-text-3xl">{successTitle}</h4>
          <p>{successContent}</p>
        </div>
        <Button
          className="plc-mt-6"
          onClick={onClose}
          autoFocus={true}
        >
          {t("continue")}
        </Button>
      </div>
    );
  }
  return null;
};

const getCurrentFlow = () => {
  const { product, giftRecipient, giftCode } = usePelcro.getStore();

  if (giftRecipient) {
    return "giftCreate";
  } else if (giftCode) {
    return "giftRedeem";
  } else if (product) {
    return "subscriptionSuccess";
  }
};

const getSuccessContent = (i18n) => {
  const flow = getCurrentFlow();
  const { product } = usePelcro.getStore();

  const wordingDictionary = {
    subscriptionSuccess: {
      successIcon: (
        <CheckMark className="plc-w-32 plc-my-4 plc-text-green-500" />
      ),
      successTitle: product?.paywall?.success_title,
      successContent: product?.paywall?.success_content
    },
    giftCreate: {
      successIcon: (
        <GiftIcon className="plc-w-32 plc-my-4 plc-text-gray-400" />
      ),
      successTitle: i18n("messages.giftCreate.title"),
      successContent: i18n("messages.giftCreate.content")
    },
    giftRedeem: {
      successIcon: (
        <CheckMark className="plc-w-32 plc-my-4 plc-text-green-500" />
      ),
      successTitle: i18n("messages.giftRedeem.title"),
      successContent: i18n("messages.giftRedeem.content")
    }
  };

  return wordingDictionary[flow];
};
