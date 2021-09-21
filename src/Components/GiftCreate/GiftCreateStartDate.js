import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./GiftCreateContainer";
import { Loader } from "../../SubComponents/Loader";
import { DatePicker } from "../../SubComponents/DatePicker";
import { SET_START_DATE } from "../../utils/action-types";

const nowDate = new Date();
const nowDateISO = nowDate.toISOString().substr(0, 10);
const yearFromNowDateISO = new Date(
  new Date().setFullYear(nowDate.getFullYear() + 1)
)
  .toISOString()
  .substr(0, 10);

export const GiftCreateStartDate = (props) => {
  const { t } = useTranslation("register");
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_START_DATE, payload: value });
  };

  if (state.loading) {
    return <Loader />;
  }

  return (
    <DatePicker
      min={nowDateISO}
      max={yearFromNowDateISO}
      value={state.startDate ?? nowDateISO}
      onChange={(e) => handleInputChange(e.target.value)}
      tooltipText={t("gift.messages.giftDateInfo")}
      {...props}
    />
  );
};
