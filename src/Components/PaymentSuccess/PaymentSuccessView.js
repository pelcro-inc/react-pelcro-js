import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { ReactComponent as CheckMark } from "../../assets/check-solid.svg";
import { ReactComponent as GiftIcon } from "../../assets/gift.svg";
import { usePelcro } from "../../hooks/usePelcro";
import { ReactComponent as CloseIcon } from "../../assets/x-icon.svg";

export const PaymentSuccessView = ({ onClose }) => {
  const { t } = useTranslation("success");
  const { switchView } = usePelcro();
  const { successTitle, successContent, successIcon, isError, errorActions } =
    getSuccessContent(t);

  if (successTitle && successContent) {
    return (
      <div className="plc-flex plc-flex-col plc-items-center plc-relative">
        <button
          type="button"
          className="pelcro-modal-close plc-absolute plc-top-6 plc-right-0"
          aria-label="close modal"
          onClick={onClose}
        >
          <CloseIcon className="plc-fill-current" />
        </button>

        {successIcon}
        <div className="plc-text-center plc-text-gray-900">
          <h4 className="plc-mb-4 plc-text-3xl">{successTitle}</h4>
          <p>{successContent}</p>
        </div>
        
        <div className="plc-mt-6 plc-flex plc-flex-col plc-gap-3 plc-w-full">
          {isError && errorActions ? (
            <>
              <Button
                onClick={() => {
                  // Clear error state and go to redeem modal
                  usePelcro.getStore().set({ giftRedemptionError: null });
                  switchView("gift-redeem");
                }}
                className="plc-w-full plc-bg-primary plc-text-white"
              >
                Try Another Code
              </Button>
              <Button 
                onClick={onClose} 
                className="plc-w-full plc-bg-gray-200 plc-text-gray-700"
                autoFocus={true}
              >
                Continue
              </Button>
            </>
          ) : (
            <Button
              onClick={onClose}
              className="plc-w-full"
              autoFocus={true}
            >
              {t("continue")}
            </Button>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const getCurrentFlow = () => {
  const { product, giftRecipient, giftCode, invoice, giftRedemptionError, giftRedemptionSuccess } =
    usePelcro.getStore();

  if (invoice) {
    return "invoicePayment";
  } else if (giftRecipient) {
    return "giftCreate";
  } else if (giftRedemptionError) {
    return "giftRedeemError";
  } else if (giftRedemptionSuccess || giftCode) {
    return "giftRedeem";
  } else if (product) {
    return "subscriptionSuccess";
  }
};

const getSuccessContent = (i18n) => {
  const flow = getCurrentFlow();
  const { product, isProcessingInvoice, giftRedemptionError } = usePelcro.getStore();

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
    giftRedeemError: {
      successIcon: (
        <GiftIcon className="plc-w-32 plc-my-4 plc-text-orange-500" />
      ),
      successTitle: "Unable to Redeem Gift",
      successContent: `The gift code "${giftRedemptionError?.code}" could not be redeemed. It may be expired, already used, or invalid.`,
      isError: true,
      errorActions: true
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
