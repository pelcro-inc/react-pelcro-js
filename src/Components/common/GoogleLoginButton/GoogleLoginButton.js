import React, { useContext } from "react";
import { GoogleLogin } from "react-google-login";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";

export const GoogleLoginButton = ({
  label = "Continue With Google",
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const googleLoginEnabled = window.Pelcro.site.read()?.google_app_id;

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  const onSuccess = (response) => {
    const profile = response.getBasicProfile();
    const accessToken = response.getAuthResponse()?.id_token;

    loginDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "google",
        idpToken: accessToken,
        email: profile.getEmail?.(),
        firstName: profile.getGivenName?.(),
        lastName: profile.getFamilyName?.()
      }
    });

    registerDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "google",
        idpToken: accessToken,
        email: profile.getEmail?.(),
        firstName: profile.getGivenName?.(),
        lastName: profile.getFamilyName?.()
      }
    });
  };

  const onFailure = (error) => {
    console.error(error);
  };

  return googleLoginEnabled ? (
    <GoogleLogin
      clientId={window.Pelcro.site.read().google_app_id}
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          className={`plc-flex plc-items-center plc-justify-center plc-h-11 plc-px-5 plc-text-gray-700 plc-rounded-md pelcro-google-login plc-shadow-md_dark shadow plc-flex-1 ${className}`}
        >
          <GoogleLogoIcon
            className={`plc-w-6 plc-h-auto pelcro-google-login-icon" ${iconClassName}`}
          />
          <p
            className={`pelcro-google-login-label plc-ml-1 ${labelClassName}`}
          >
            {label}
          </p>
        </button>
      )}
    />
  ) : null;
};
