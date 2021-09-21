import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { store } from "./ProfilePicChangeContainer";
import { ReactComponent as XIcon } from "../../assets/x-icon.svg";
import { REMOVE_IMAGE } from "../../utils/action-types";

export const ProfilePicChangeRemoveButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    dispatch,
    state: { isSubmitting }
  } = useContext(store);

  const { t } = useTranslation("userEdit");

  return (
    <Button
      icon={<XIcon className="plc-h-6 plc-w-6" />}
      isLoading={isSubmitting}
      onClick={() => {
        dispatch({ type: REMOVE_IMAGE });
        onClick?.();
      }}
      {...otherProps}
    >
      {name ?? t("labels.removeImage")}
    </Button>
  );
};
