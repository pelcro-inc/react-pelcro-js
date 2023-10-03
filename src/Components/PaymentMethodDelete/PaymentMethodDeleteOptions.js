import React, { useContext } from "react";
import { Radio } from "../../SubComponents/Radio";
import { SET_DELETE_PAYMENT_METHOD_OPTION } from "../../utils/action-types";
import { store } from "./PaymentMethodDeleteContainer";
import { useTranslation } from "react-i18next";

export const PaymentMethodDeleteOptions = ({
  subscription,
  hasPhases,
  onClick,
  className
}) => {
  const {
    state: { deleteOption, paymentMethods },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("paymentMethod");

  const handleOptionSelect = (event) => {
    dispatch({
      type: SET_DELETE_PAYMENT_METHOD_OPTION,
      payload: event.target.value
    });
  };

  return (
    <div className="plc-text-left plc-mr-auto plc-mb-6">
      {/* {paymentMethods && paymentMethods.length !== 1 && (
        <Radio
          onChange={handleOptionSelect}
          checked={deleteOption === "select"}
          value="select"
        >
          {t("delete.options.select")}
        </Radio>
      )} */}

      <Radio
        onChange={handleOptionSelect}
        checked={deleteOption === "add"}
        value="add"
      >
        {t("delete.options.add")}
      </Radio>
    </div>
  );
};
