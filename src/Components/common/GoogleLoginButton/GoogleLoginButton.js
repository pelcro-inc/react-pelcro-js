import React, { useContext, useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";
import { gapi } from 'gapi-script';
import { notifyBugsnag, trackGoogleLoginEvent, getGoogleLoginDiagnostics, detectPopupBlockers } from "../../../utils/utils";

export const GoogleLoginButton = ({
  label = "Google",
  className = "",
  labelClassName = "",
  iconClassName = ""
}) => {
  const googleClientId = window.Pelcro.site.read()?.google_app_id;
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState(null);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const { dispatch: loginDispatch } = useContext(loginStore);
  const { dispatch: registerDispatch } = useContext(registerStore);

  useEffect(() => {
    // Check for popup blockers on component mount
    const popupCheck = detectPopupBlockers();
    setPopupBlocked(popupCheck.isBlocked);
    
    trackGoogleLoginEvent('Component mounted', {
      hasClientId: !!googleClientId,
      popupBlocked: popupCheck.isBlocked,
      diagnostics: getGoogleLoginDiagnostics()
    });

    // Track Google API initialization
    notifyBugsnag(() => {
      Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - Starting GAPI initialization', {
        source: 'react-pelcro-js',
        component: 'GoogleLoginButton',
        googleClientId: googleClientId ? 'present' : 'missing',
        siteId: window.Pelcro?.site?.read()?.id,
        userAgent: navigator.userAgent,
        popupBlocked: popupCheck.isBlocked,
        timestamp: new Date().toISOString()
      });
    });

    if (!googleClientId) {
      trackGoogleLoginEvent('Missing Google Client ID', {
        site: window.Pelcro?.site?.read(),
        diagnostics: getGoogleLoginDiagnostics()
      });
      
      notifyBugsnag(() => {
        Bugsnag.notify(new Error('react-pelcro-js: Google Client ID is missing'), (event) => {
          event.addMetadata('react-pelcro-js: GoogleLogin', {
            source: 'react-pelcro-js',
            component: 'GoogleLoginButton',
            error: 'Missing Google Client ID',
            diagnostics: getGoogleLoginDiagnostics()
          });
        });
      });
      setInitError('Missing Google Client ID');
      return;
    }

    try {
      gapi.load("client:auth2", () => {
        trackGoogleLoginEvent('GAPI client:auth2 loaded');
        
        notifyBugsnag(() => {
          Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - GAPI client:auth2 loaded successfully', {
            source: 'react-pelcro-js',
            component: 'GoogleLoginButton'
          });
        });

        gapi.auth2.init({ clientId: googleClientId })
          .then(() => {
            trackGoogleLoginEvent('GAPI auth2 initialized successfully', {
              clientId: googleClientId.substring(0, 10) + '...',
              isSignedIn: gapi.auth2.getAuthInstance().isSignedIn.get()
            });
            
            notifyBugsnag(() => {
              Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - GAPI auth2 initialized successfully', {
                source: 'react-pelcro-js',
                component: 'GoogleLoginButton',
                clientId: googleClientId.substring(0, 10) + '...',
                isSignedIn: gapi.auth2.getAuthInstance().isSignedIn.get(),
                timestamp: new Date().toISOString()
              });
            });
            setIsInitialized(true);
          })
          .catch((error) => {
            trackGoogleLoginEvent('GAPI auth2 initialization failed', {
              error: error.message,
              diagnostics: getGoogleLoginDiagnostics()
            });
            
            notifyBugsnag(() => {
              Bugsnag.notify(new Error(`react-pelcro-js: GAPI auth2 initialization failed - ${error.message}`), (event) => {
                event.addMetadata('react-pelcro-js: GoogleLogin', {
                  source: 'react-pelcro-js',
                  component: 'GoogleLoginButton',
                  error: 'GAPI auth2 initialization failed',
                  errorDetails: error.message,
                  clientId: googleClientId.substring(0, 10) + '...',
                  diagnostics: getGoogleLoginDiagnostics()
                });
              });
            });
            setInitError(error.message);
            console.error('GAPI auth2 initialization failed:', error);
          });
      });
    } catch (error) {
      trackGoogleLoginEvent('GAPI load failed', {
        error: error.message,
        diagnostics: getGoogleLoginDiagnostics()
      });
      
      notifyBugsnag(() => {
        Bugsnag.notify(new Error(`react-pelcro-js: GAPI load failed - ${error.message}`), (event) => {
          event.addMetadata('react-pelcro-js: GoogleLogin', {
            source: 'react-pelcro-js',
            component: 'GoogleLoginButton',
            error: 'GAPI load failed',
            errorDetails: error.message,
            clientId: googleClientId.substring(0, 10) + '...',
            diagnostics: getGoogleLoginDiagnostics()
          });
        });
      });
      setInitError(error.message);
      console.error('GAPI load failed:', error);
    }
  }, [googleClientId]);

  const onSuccess = (response) => {
    trackGoogleLoginEvent('Login success', {
      hasProfile: !!response.getBasicProfile(),
      hasAuthResponse: !!response.getAuthResponse(),
      email: response.getBasicProfile()?.getEmail?.()?.substring(0, 10) + '...'
    });

    notifyBugsnag(() => {
      Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - Login success', {
        source: 'react-pelcro-js',
        component: 'GoogleLoginButton',
        hasProfile: !!response.getBasicProfile(),
        hasAuthResponse: !!response.getAuthResponse(),
        email: response.getBasicProfile()?.getEmail?.()?.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
    });

    const profile = response.getBasicProfile();
    const accessToken = response.getAuthResponse()?.id_token;

    if (!profile || !accessToken) {
      trackGoogleLoginEvent('Missing profile or token in success response', {
        hasProfile: !!profile,
        hasAuthResponse: !!response.getAuthResponse(),
        hasAccessToken: !!accessToken,
        responseKeys: Object.keys(response)
      });
      
      notifyBugsnag(() => {
        Bugsnag.notify(new Error('react-pelcro-js: Google login response missing profile or token'), (event) => {
          event.addMetadata('react-pelcro-js: GoogleLogin', {
            source: 'react-pelcro-js',
            component: 'GoogleLoginButton',
            error: 'Missing profile or token in success response',
            hasProfile: !!profile,
            hasAuthResponse: !!response.getAuthResponse(),
            hasAccessToken: !!accessToken,
            responseKeys: Object.keys(response),
            diagnostics: getGoogleLoginDiagnostics()
          });
        });
      });
      return;
    }

    const payload = {
      idpName: "google",
      idpToken: accessToken,
      email: profile.getEmail?.(),
      firstName: profile.getGivenName?.(),
      lastName: profile.getFamilyName?.()
    };

    trackGoogleLoginEvent('Dispatching social login', {
      email: payload.email?.substring(0, 10) + '...',
      hasFirstName: !!payload.firstName,
      hasLastName: !!payload.lastName
    });

    notifyBugsnag(() => {
      Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - Dispatching social login', {
        source: 'react-pelcro-js',
        component: 'GoogleLoginButton',
        email: payload.email?.substring(0, 10) + '...',
        hasFirstName: !!payload.firstName,
        hasLastName: !!payload.lastName,
        timestamp: new Date().toISOString()
      });
    });

    loginDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload
    });

    registerDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload
    });
  };

  const onFailure = (error) => {
    trackGoogleLoginEvent('Login failure', {
      error: error.message,
      errorCode: error.error,
      errorSubtype: error.error_subtype,
      errorReason: error.error_reason,
      errorDescription: error.error_description,
      isInitialized,
      initError,
      popupBlocked
    });
    
    notifyBugsnag(() => {
      Bugsnag.notify(new Error(`react-pelcro-js: Google login failure - ${error.message}`), (event) => {
        event.addMetadata('react-pelcro-js: GoogleLogin', {
          source: 'react-pelcro-js',
          component: 'GoogleLoginButton',
          error: 'Google login failure',
          errorDetails: error.message,
          errorCode: error.error,
          errorSubtype: error.error_subtype,
          errorReason: error.error_reason,
          errorDescription: error.error_description,
          diagnostics: getGoogleLoginDiagnostics(),
          isInitialized,
          initError,
          popupBlocked
        });
      });
    });
    console.error('Google login failure:', error);
  };

  const handleButtonClick = (renderProps) => {
    // Re-check popup blockers on each click
    const currentPopupCheck = detectPopupBlockers();
    setPopupBlocked(currentPopupCheck.isBlocked);
    
    trackGoogleLoginEvent('Button clicked', {
      isInitialized,
      initError,
      hasClientId: !!googleClientId,
      isSignedIn: gapi.auth2?.getAuthInstance()?.isSignedIn?.get(),
      popupBlocked: currentPopupCheck.isBlocked,
      diagnostics: getGoogleLoginDiagnostics()
    });

    notifyBugsnag(() => {
      Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - Button clicked', {
        source: 'react-pelcro-js',
        component: 'GoogleLoginButton',
        isInitialized,
        initError,
        hasClientId: !!googleClientId,
        isSignedIn: gapi.auth2?.getAuthInstance()?.isSignedIn?.get(),
        popupBlocked: currentPopupCheck.isBlocked,
        timestamp: new Date().toISOString()
      });
    });

    // Check if GAPI is properly initialized
    if (!isInitialized) {
      trackGoogleLoginEvent('Button clicked before initialization', {
        isInitialized,
        initError,
        hasClientId: !!googleClientId,
        diagnostics: getGoogleLoginDiagnostics()
      });
      
      notifyBugsnag(() => {
        Bugsnag.notify(new Error('react-pelcro-js: Google login attempted before initialization'), (event) => {
          event.addMetadata('react-pelcro-js: GoogleLogin', {
            source: 'react-pelcro-js',
            component: 'GoogleLoginButton',
            error: 'Button clicked before GAPI initialization',
            isInitialized,
            initError,
            hasClientId: !!googleClientId,
            diagnostics: getGoogleLoginDiagnostics()
          });
        });
      });
      return;
    }

    // Check for popup blockers
    if (currentPopupCheck.isBlocked) {
      trackGoogleLoginEvent('Popup blocked detected', {
        diagnostics: getGoogleLoginDiagnostics()
      });
      
      notifyBugsnag(() => {
        Bugsnag.notify(new Error('react-pelcro-js: Popup blockers detected'), (event) => {
          event.addMetadata('react-pelcro-js: GoogleLogin', {
            source: 'react-pelcro-js',
            component: 'GoogleLoginButton',
            error: 'Popup blockers detected',
            diagnostics: getGoogleLoginDiagnostics()
          });
        });
      });
    }

    renderProps.onClick();
  };

  // Track component mount and unmount
  useEffect(() => {
    trackGoogleLoginEvent('Component mounted', {
      hasClientId: !!googleClientId,
      diagnostics: getGoogleLoginDiagnostics()
    });

    notifyBugsnag(() => {
      Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - Component mounted', {
        source: 'react-pelcro-js',
        component: 'GoogleLoginButton',
        hasClientId: !!googleClientId,
        site: window.Pelcro?.site?.read()?.id,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    });

    return () => {
      trackGoogleLoginEvent('Component unmounted', {
        isInitialized,
        initError
      });
      
      notifyBugsnag(() => {
        Bugsnag.leaveBreadcrumb('react-pelcro-js: GoogleLoginButton - Component unmounted', {
          source: 'react-pelcro-js',
          component: 'GoogleLoginButton',
          isInitialized,
          initError,
          timestamp: new Date().toISOString()
        });
      });
    };
  }, []);

  return googleClientId ? (
    <GoogleLogin
      clientId={googleClientId}
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <button
          onClick={() => handleButtonClick(renderProps)}
          disabled={!isInitialized}
          className={`plc-flex plc-items-center plc-justify-center plc-p-3 plc-space-x-3 plc-text-gray-700 plc-border plc-border-gray-200 plc-rounded-3xl hover:plc-bg-gray-200 pelcro-google-login ${className} ${!isInitialized ? 'plc-opacity-50 plc-cursor-not-allowed' : ''}`}
          title={popupBlocked ? 'Popup blockers detected. Please allow popups for this site.' : ''}
        >
          <GoogleLogoIcon
            className={`plc-w-6 plc-h-auto pelcro-google-login-icon" ${iconClassName}`}
          />
          <p
            className={`pelcro-google-login-label ${labelClassName}`}
          >
            {label}
          </p>
          {popupBlocked && (
            <span className="plc-text-xs plc-text-red-500 plc-ml-2">⚠️</span>
          )}
        </button>
      )}
    />
  ) : null;
};
