import React, { useContext } from "react";
import { GoogleLogin } from "./GoogleLoginCompat";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";

export const GoogleLoginButton = ({
  label = "Google",
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const { t } = useTranslation("login");
  const googleClientId = window.Pelcro.site.read()?.google_app_id;

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  const onSuccess = (response) => {
    const profile = response.getBasicProfile();
    const idToken = response.getAuthResponse()?.id_token;

    const payload = {
      idpName: "google",
      idpToken: idToken,
      email: profile.getEmail(),
      firstName: profile.getGivenName(),
      lastName: profile.getFamilyName()
    };

    if (loginDispatch) {
      loginDispatch({
        type: HANDLE_SOCIAL_LOGIN,
        payload
      });
    }

    if (registerDispatch) {
      registerDispatch({
        type: HANDLE_SOCIAL_LOGIN,
        payload
      });
    }
  };

  const onFailure = (error) => {
    console.error(error);
  };

  return googleClientId ? (
    <GoogleLogin
      clientId={googleClientId}
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className={`plc-flex plc-items-center plc-justify-center plc-p-3 plc-space-x-3 plc-text-gray-700 plc-border plc-border-gray-200 plc-rounded-3xl hover:plc-bg-gray-200 pelcro-google-login ${className}`}
        >
          <GoogleLogoIcon
            className={`plc-w-6 plc-h-auto pelcro-google-login-icon" ${iconClassName}`}
          />
          <p
            className={`pelcro-google-login-label ${labelClassName}`}
          >
            {label}
          </p>
        </button>
      )}
    />
  ) : null;
};
