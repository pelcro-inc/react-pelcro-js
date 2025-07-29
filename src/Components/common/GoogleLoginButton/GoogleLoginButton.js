import React, { useContext, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";
import { gapi } from 'gapi-script';
import { notifyBugsnag } from "../../../utils/utils";
import { notify } from "../../../SubComponents/Notification";

export const GoogleLoginButton = ({
  label = "Google",
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const googleClientId = window.Pelcro.site.read()?.google_app_id;

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: googleClientId });
    });
  }, [googleClientId]);

  const onSuccess = (response) => {
    const profile = response.getBasicProfile();
    const accessToken = response.getAuthResponse()?.id_token;

    const payload = {
      idpName: "google",
      idpToken: accessToken,
      email: profile.getEmail?.(),
      firstName: profile.getGivenName?.(),
      lastName: profile.getFamilyName?.()
    };

    loginDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload
    });

    registerDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload
    });

    // Simple success logging
    notifyBugsnag(() => {
      Bugsnag.leaveBreadcrumb('react-pelcro-js: Google login success', {
        source: 'react-pelcro-js',
        component: 'GoogleLoginButton',
        email: profile.getEmail?.()?.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
      Bugsnag.notify("react-pelcro-js: Google login success", (event) => {
        event.addMetadata("react-pelcro-js: GoogleLogin", {
          source: "react-pelcro-js",
          component: "GoogleLoginButton",
          email: profile.getEmail?.()?.substring(0, 10) + "...",
          timestamp: new Date().toISOString()
        });
      });
    });
  };

  const onFailure = (error) => {
    console.error('Google login failure:', error);
    console.log('Google login error details:', {
      error: error.error,
      message: error.message,
      details: error.details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // Show simple error notification with fallback for missing error message
    const errorMessage = error.message || error.error || 'Unknown error';
    notify.error("Google login failed. Please try again. Error: " + errorMessage);
    
    // Enhanced failure logging with debugging info
    notifyBugsnag(() => {
      Bugsnag.notify(new Error(`react-pelcro-js: Google login failed - ${errorMessage}`), (event) => {
        event.addMetadata('react-pelcro-js: GoogleLogin', {
          source: 'react-pelcro-js',
          component: 'GoogleLoginButton',
          error: error.message || 'No error message',
          errorCode: error.error || 'No error code',
          errorDetails: error.details || 'No details',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          googleClientId: googleClientId ? 'configured' : 'not-configured',
          site: window.Pelcro?.site?.read()?.id,
          user: window.Pelcro?.user?.read()?.id,
          environment: window.Pelcro?.environment,
          uiVersion: window.Pelcro?.uiSettings?.uiVersion,
          googleClientId: googleClientId ? 'configured ' + googleClientId : 'not-configured',
          allErrors: error,
        });
    
      });
    });
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
