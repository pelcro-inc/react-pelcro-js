import React, { useContext, useEffect  } from "react";
import { GoogleLogin } from "react-google-login";
import { useTranslation } from "react-i18next";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN, SHOW_ALERT } from "../../../utils/action-types";
import { gapi } from 'gapi-script';

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

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: googleClientId });
    });
  }, []);

  const onSuccess = (response) => {
    const profile = response.getBasicProfile();
    const accessToken = response.getAuthResponse()?.id_token;
    const email = profile.getEmail?.();

    // Check if email is provided by Google
    if (!email) {
      // Show error message for both login and register stores
      loginDispatch?.({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: t("errors.googleNoEmail")
        }
      });

      registerDispatch?.({
        type: SHOW_ALERT,
        payload: {
          type: "error",
          content: t("errors.googleNoEmail")
        }
      });
      return;
    }

    // Proceed with social login if email is available
    loginDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "google",
        idpToken: accessToken,
        email: email,
        firstName: profile.getGivenName?.(),
        lastName: profile.getFamilyName?.()
      }
    });

    registerDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload: {
        idpName: "google",
        idpToken: accessToken,
        email: email,
        firstName: profile.getGivenName?.(),
        lastName: profile.getFamilyName?.()
      }
    });
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
