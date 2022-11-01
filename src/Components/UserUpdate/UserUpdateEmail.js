import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { store } from "./UserUpdateContainer";
import { SET_EMAIL, SET_EMAIL_ERROR } from "../../utils/action-types";
import { Email } from "../../SubComponents/Email";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as CancelIcon } from "../../assets/x-icon.svg";
import { Button } from "../../SubComponents/Button";

export const UserUpdateEmail = (props) => {
  const {
    dispatch,
    state: { email, emailError }
  } = useContext(store);
  const [enableEmailEdit, setEnableEmailEdit] = useState(false);
  const { t } = useTranslation("userEdit");

  const handleEnableEmailEdit = () => {
    if (enableEmailEdit) {
      dispatch({ type: SET_EMAIL, payload: email });
      dispatch({
        type: SET_EMAIL_ERROR,
        payload: null
      });
      setEnableEmailEdit(false);
    } else {
      setEnableEmailEdit(true);
    }
  };

  return (
    <div>
      <div className="plc-flex plc-items-start plc-relative">
        <Email
          disabled={!enableEmailEdit}
          store={store}
          label={t("labels.email")}
          enableEmailEdit={enableEmailEdit}
          {...props}
        />
        <Button
          variant="icon"
          className="plc-absolute  plc-rounded-none plc-text-gray-500 plc-w-12 plc-h-12 plc-top-7 plc-right-0 hover:plc-text-gray-900 hover:plc-bg-transparent focus:plc-ring-0 focus:plc-shadow-none"
          icon={
            enableEmailEdit ? (
              <CancelIcon className="plc-w-6" />
            ) : (
              <EditIcon />
            )
          }
          id={"pelcro-user-update-picture-button"}
          onClick={handleEnableEmailEdit}
        />
      </div>
    </div>
  );
};
