import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_USER_UPDATE } from "../../utils/action-types";
import { store } from "./ProfilePicChangeContainer";

export const ProfilePicChangeButton = ({ name, ...otherProps }) => {
  const {
    state: { isSubmitting },
    dispatch
  } = useContext(store);

  const { t } = useTranslation("userEdit");

  return (
    <Button
      {...otherProps}
      onClick={() => dispatch({ type: HANDLE_USER_UPDATE })}
      isLoading={isSubmitting}
      isFullWidth={true}
    >
      {name ?? t("labels.save")}
    </Button>
  );
};
