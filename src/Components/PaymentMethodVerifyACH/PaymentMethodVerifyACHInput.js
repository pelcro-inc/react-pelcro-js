import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./PaymentMethodVerifyACHContainer";
import { SET_VERIFICATION_CODE } from "../../utils/action-types";

export const PaymentMethodVerifyACHInput = () => {
  const { t } = useTranslation("paymentMethod");
  const {
    dispatch,
    state: { verificationCode }
  } = useContext(store);

  const handleCodeChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      dispatch({
        type: SET_VERIFICATION_CODE,
        payload: value
      });
    }
  };

  return (
    <div className="plc-mb-4">
      <label
        htmlFor="pelcro-input-verification-code"
        className="plc-block plc-text-sm plc-font-medium plc-text-gray-700 plc-mb-2"
      >
        {t("verifyACH.codeLabel")}
      </label>
      <input
        autoFocus
        type="text"
        id="pelcro-input-verification-code"
        className="plc-w-full plc-px-3 plc-py-2 plc-text-lg plc-tracking-widest plc-text-center plc-uppercase plc-border plc-border-gray-300 plc-rounded-md focus:plc-outline-none focus:plc-ring-2 focus:plc-ring-primary-500"
        value={verificationCode}
        onChange={handleCodeChange}
        placeholder="SM11AB"
        maxLength={6}
      />
      <p className="plc-mt-2 plc-text-xs plc-text-gray-500">
        {t("verifyACH.codeHelp")}
      </p>
    </div>
  );
};
