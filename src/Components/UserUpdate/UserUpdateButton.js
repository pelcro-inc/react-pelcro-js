import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../SubComponents/Button";
import { HANDLE_USER_UPDATE } from "../../utils/action-types";
import { store } from "./UserUpdateContainer";

export const UserUpdateButton = ({
  name,
  onClick,
  ...otherProps
}) => {
  const {
    state: {
      buttonDisabled,
      email,
      firstName,
      lastName,
      phone,
      emailError,
      firstNameError,
      lastNameError,
      phoneError
    },
    dispatch
  } = useContext(store);

  const supportsTap = Boolean(
    window.Pelcro.site.read()?.tap_gateway_settings
  );

  const { t } = useTranslation("userEdit");

  const [isDisabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(
      buttonDisabled ||
        emailError ||
        firstNameError ||
        lastNameError ||
        phoneError ||
        !email?.length ||
        (supportsTap && !firstName?.length) ||
        (supportsTap && !lastName?.length) ||
        (supportsTap && !phone?.length)
    );
  }, [
    email,
    firstName,
    lastName,
    phone,
    buttonDisabled,
    emailError,
    firstNameError,
    lastNameError,
    phoneError
  ]);

  return (
    <Button
      onClick={() => {
        dispatch({ type: HANDLE_USER_UPDATE });
        onClick?.();
      }}
      disabled={isDisabled}
      isLoading={buttonDisabled && !emailError}
      {...otherProps}
    >
      {name ?? t("labels.submit")}
    </Button>
  );
};
