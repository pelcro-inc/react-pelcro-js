import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMark } from "../../assets/check-solid.svg";
import { ReactComponent as GiftIcon } from "../../assets/gift.svg";
import { usePelcro } from "../../hooks/usePelcro";
import { ReactComponent as CloseIcon } from "../../assets/x-icon.svg";

export const PaymentSuccessView = ({ onClose }) => {
  const { t } = useTranslation("success");
  const { successTitle, successContent, successIcon } =
    getSuccessContent(t);

  if (successTitle && successContent) {
    return (
      <div className="plc-flex plc-flex-col plc-items-center plc-relative">
        {successIcon}
        <div className="plc-text-center plc-text-gray-900">
          <h4 className="plc-mb-4 plc-text-3xl">{successTitle}</h4>
          <p>{successContent}</p>
        </div>
        {/* <Button
          className="plc-mt-6"
          onClick={onClose}
          autoFocus={true}
        >
          {t("continue")}
        </Button> */}
      </div>
    );
  }
  return null;
};

const getCurrentFlow = () => {
  const { product, giftRecipient, giftCode, invoice } =
    usePelcro.getStore();

  if (invoice) {
    return "invoicePayment";
  } else if (giftRecipient) {
    return "giftCreate";
  } else if (giftCode) {
    return "giftRedeem";
  } else if (product) {
    return "subscriptionSuccess";
  }
};

const getSuccessContent = (i18n) => {
  const flow = getCurrentFlow();
  const { product, isProcessingInvoice } = usePelcro.getStore();

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
        <GiftIcon className="plc-w-32 plc-my-4 plc-text-gray-500" />
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
    },
    invoicePayment: {
      successIcon: (
        <CheckMark className="plc-w-32 plc-my-4 plc-text-green-500" />
      ),
      successTitle: isProcessingInvoice
        ? i18n("messages.invoicePayment.paymentProcessing")
        : i18n("messages.invoicePayment.title"),
      successContent: i18n("messages.invoicePayment.content")
    }
  };

  return wordingDictionary[flow];
};
