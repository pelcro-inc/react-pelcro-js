import React, { useContext } from "react";
// import { useTranslation } from "react-i18next";
import { store } from "./UserUpdateContainer";
import { Loader } from "../../SubComponents/Loader";
import { DatePicker } from "../../SubComponents/DatePicker";
import { SET_DATE_OF_BIRTH } from "../../utils/action-types";

const nowDate = new Date();
const nowDateISO = nowDate.toISOString().substr(0, 10);
const hundredYearsFromNowDateISO = new Date(
  new Date().setFullYear(nowDate.getFullYear() - 100)
)
  .toISOString()
  .substr(0, 10);

export const UserUpdateDateOfBirth = (props) => {
  //   const { t } = useTranslation("userEdit");
  const { dispatch, state } = useContext(store);

  const handleInputChange = (value) => {
    dispatch({ type: SET_DATE_OF_BIRTH, payload: value });
  };

  if (state.loading) {
    return <Loader />;
  }

  return (
    <DatePicker
      min={hundredYearsFromNowDateISO}
      max={nowDateISO}
      value={state.dateOfBirth}
      onChange={(e) => handleInputChange(e.target.value)}
      //   tooltipText={t("labels.dateOfBirth")}
      {...props}
    />
  );
};
