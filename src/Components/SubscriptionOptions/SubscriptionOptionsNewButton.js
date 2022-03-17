import React, { useContext } from "react";
import { store } from "./SubscriptionOptionsContainer";
import { SWITCH_TO_NEW } from "../../utils/action-types";
import { useTranslation } from "react-i18next";
import { Radio } from "../../SubComponents/Radio";
import { ReactComponent as NewIcon } from "../../assets/plus-circle.svg";

export const SubscriptionOptionsNewButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { selectedOption }
  } = useContext(store);

  const { t } = useTranslation("subscriptionOptions");

  const isChecked = selectedOption === "new";

  return (
    <Radio
      className="plc-hidden pelcro-new-sub-option"
      labelClassName={`plc-flex plc-flex-col plc-items-center plc-justify-center plc-text-lg plc-font-semibold plc-ml-0 plc-w-52 plc-h-52 plc-text-black plc-p-2 hover:plc-bg-gray-200 pelcro-new-sub-option-label plc-border-2 plc-text-center ${
        isChecked ? "plc-border-black" : "plc-border-gray-300"
      }`}
      id="pelcro-new-sub-option"
      name="option"
      onChange={() => {
        dispatch({ type: SWITCH_TO_NEW });
        onClick?.();
      }}
      checked={isChecked}
      {...otherProps}
    >
      {name ?? t("addNew")}
      <NewIcon className="plc-w-full plc-h-full plc-mr-0" />
    </Radio>
  );
};
