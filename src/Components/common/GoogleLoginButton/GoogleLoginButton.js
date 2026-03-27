import React, { useContext, useEffect } from "react";
import { GoogleLogin } from "react-google-login";
import { store as loginStore } from "../../Login/LoginContainer";
import { store as registerStore } from "../../Register/RegisterContainer";
import { ReactComponent as GoogleLogoIcon } from "../../../assets/google-logo.svg";
import { HANDLE_SOCIAL_LOGIN } from "../../../utils/action-types";
import { gapi } from 'gapi-script';
import { notifyBugsnag } from "../../../utils/utils";
import { notify } from "../../../SubComponents/Notification";
import ReactGA4 from "react-ga4";

// Helper function to determine the type of Google login failure
const determineFailureType = (error) => {
  const errorCode = error.error;
  const errorMessage = error.message || '';
  const errorDetails = error.details || '';
  
  // Check for popup/tab closed by user (most common scenario)
  if (errorCode === 'popup_closed_by_user' || 
      errorCode === 'access_denied' ||
      errorMessage.includes('popup closed') || 
      errorMessage.includes('user closed') ||
      errorMessage.includes('access denied') ||
      errorMessage.includes('user cancelled') ||
      errorMessage.includes('user canceled')) {
    return 'popup_closed_by_user';
  }
  
  // Check for browser blocking popup
  if (errorCode === 'popup_blocked' || 
      errorCode === 'popup_closed_by_browser' ||
      errorMessage.includes('popup blocked') || 
      errorMessage.includes('blocked by browser') ||
      errorMessage.includes('popup window blocked') ||
      errorMessage.includes('window blocked')) {
    return 'popup_blocked_by_browser';
  }
  
  // Check for network/connection issues
  if (errorCode === 'network_error' || 
      errorCode === 'timeout' ||
      errorMessage.includes('network') || 
      errorMessage.includes('connection') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('offline')) {
    return 'network_error';
  }
  
  // Check for authentication errors (OAuth 2.0 standard errors)
  if (errorCode === 'access_denied' || 
      errorCode === 'invalid_grant' ||
      errorCode === 'invalid_request' ||
      errorCode === 'invalid_scope' ||
      errorCode === 'server_error' ||
      errorCode === 'temporarily_unavailable' ||
      errorMessage.includes('authentication failed') ||
      errorMessage.includes('invalid grant') ||
      errorMessage.includes('invalid request')) {
    return 'authentication_error';
  }
  
  // Check for configuration errors (client-side issues)
  if (errorCode === 'invalid_client' || 
      errorCode === 'unauthorized_client' ||
      errorCode === 'unsupported_response_type' ||
      errorMessage.includes('invalid client') ||
      errorMessage.includes('unauthorized client') ||
      errorMessage.includes('unsupported response type')) {
    return 'configuration_error';
  }
  
  // Check for immediate_failed (when using immediate mode)
  if (errorCode === 'immediate_failed') {
    return 'immediate_failed';
  }
  
  // Default to unknown error
  return 'unknown_error';
};

// Helper function to get user-friendly error messages
const getFailureMessage = (failureType, originalError) => {
  switch (failureType) {
    case 'popup_closed_by_user':
      return "Google login was cancelled. Please try again if you'd like to continue.";
    
    case 'popup_blocked_by_browser':
      return "Google login popup was blocked by your browser. Please allow popups for this site and try again.";
    
    case 'network_error':
      return "Network error occurred during Google login. Please check your connection and try again.";
    
    case 'authentication_error':
      return "Google login authentication failed. Please try again or use a different account.";
    
    case 'configuration_error':
      return "Google login is not properly configured. Please contact support.";
    
    case 'immediate_failed':
      return "Google login failed. This usually means you're not signed in to Google. Please sign in to Google and try again.";
    
    case 'unknown_error':
    default:
      return `Google login failed. Please try again. Error: ${originalError}`;
  }
};

export const GoogleLoginButton = ({
  label = "Google",
  className = "",
  labelClassName = "",
  iconClassName = "",
  onClick
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
    // Generate a unique flow ID for this session
    const flowId = `google_flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      notifyBugsnag(() => {
        // Set context for this flow
        window.Bugsnag.setContext(`Google Login Flow - ${flowId}`);
        window.Bugsnag.setUser(flowId, null, null);
        
        // Step 1: Google authentication successful
        window.Bugsnag.leaveBreadcrumb("Google Authentication Successful", {
          step: 1,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          site_id: window.Pelcro?.site?.read()?.id,
          google_client_id: googleClientId ? 'configured' : 'not-configured',
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for authentication success:', error);
    }

    const profile = response.getBasicProfile();
    const accessToken = response.getAuthResponse()?.id_token;

    // Step 2: Profile data extracted
    try {
      notifyBugsnag(() => {
        window.Bugsnag.leaveBreadcrumb("Profile Data Extracted", {
          step: 2,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          email: profile.getEmail?.()?.substring(0, 10) + '...',
          first_name: profile.getGivenName?.(),
          last_name: profile.getFamilyName?.(),
          has_access_token: !!accessToken,
          site_id: window.Pelcro?.site?.read()?.id,
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for profile data extraction:', error);
    }

    const payload = {
      idpName: "google",
      idpToken: accessToken,
      email: profile.getEmail?.(),
      firstName: profile.getGivenName?.(),
      lastName: profile.getFamilyName?.()
    };

    // Step 3: Dispatching to login store
    try {
      notifyBugsnag(() => {
        window.Bugsnag.leaveBreadcrumb("Dispatching to Login Store", {
          step: 3,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          action_type: HANDLE_SOCIAL_LOGIN,
          idp_name: payload.idpName,
          email: payload.email?.substring(0, 10) + '...',
          site_id: window.Pelcro?.site?.read()?.id,
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for login store dispatch:', error);
    }

    loginDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload
    });

    // Step 4: Dispatching to register store
    try {
      notifyBugsnag(() => {
        window.Bugsnag.leaveBreadcrumb("Dispatching to Register Store", {
          step: 4,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          action_type: HANDLE_SOCIAL_LOGIN,
          idp_name: payload.idpName,
          email: payload.email?.substring(0, 10) + '...',
          site_id: window.Pelcro?.site?.read()?.id,
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for register store dispatch:', error);
    }

    registerDispatch?.({
      type: HANDLE_SOCIAL_LOGIN,
      payload
    });
    
    // Step 4.5: Send immediate success notification since the flow will be handled by container
    try {
      notifyBugsnag(() => {
        console.log('Sending immediate Bugsnag success notification for flow:', flowId);
        window.Bugsnag.notify("Pelcro-React-Elements: Google Login Flow - Authentication Success", (event) => {
          event.addMetadata("GoogleLoginFlow", {
            flow_id: flowId,
            flow_type: "authentication_success",
            source: "Pelcro-React-Elements",
            component: "GoogleLoginButton",
            user_data: {
              email: profile.getEmail?.(),
              first_name: profile.getGivenName?.(),
              last_name: profile.getFamilyName?.()
            },
            site_id: window.Pelcro?.site?.read()?.id,
            environment: window.Pelcro?.environment,
            ui_version: window.Pelcro?.uiSettings?.uiVersion,
            note: "Flow will be completed by container handlers",
            total_steps: 4
          });
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for authentication success:', error);
    }

    // Step 5: Flow completed successfully
    try {
      notifyBugsnag(() => {
        window.Bugsnag.leaveBreadcrumb("Google Login Flow Completed", {
          step: 5,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          status: 'success',
          email: profile.getEmail?.()?.substring(0, 10) + '...',
          first_name: profile.getGivenName?.(),
          last_name: profile.getFamilyName?.(),
          site_id: window.Pelcro?.site?.read()?.id,
          timestamp: new Date().toISOString()
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for flow completion:', error);
    }
    
    // Track successful Google login with ReactGA4
    try {
      ReactGA4.event('pelcro_google_login_success', {
        method: 'google',
        source: 'Pelcro-React-Elements',
        component: 'GoogleLoginButton',
        email: profile.getEmail?.(),
        first_name: profile.getGivenName?.(),
        last_name: profile.getFamilyName?.(),
        site_id: window.Pelcro?.site?.read()?.id
      });
    } catch (error) {
      console.warn('GA4 pelcro_google_login_success event failed:', error);
    }
  };

  const onFailure = (error) => {
    // Generate a unique flow ID for this failed session
    const flowId = `google_flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine failure type based on error details
    const failureType = determineFailureType(error);
    
    console.error('Google login failure:', error);
    console.log('Google login error details:', {
      error: error.error,
      message: error.message,
      details: error.details,
      failure_type: failureType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
    
    // Set Bugsnag context for this failed flow
    try {
      notifyBugsnag(() => {
        window.Bugsnag.setContext(`Google Login Flow - ${flowId} (Failed)`);
        window.Bugsnag.setUser(flowId, null, null);
        
        // Step 1: Flow started
        window.Bugsnag.leaveBreadcrumb("Google Login Flow Started", {
          step: 1,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          site_id: window.Pelcro?.site?.read()?.id,
          google_client_id: googleClientId ? 'configured' : 'not-configured',
          timestamp: new Date().toISOString()
        });
        
        // Step 2: Authentication failed
        window.Bugsnag.leaveBreadcrumb("Google Authentication Failed", {
          step: 2,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          failure_type: failureType,
          error: error.message || 'No error message',
          error_code: error.error || 'No error code',
          error_details: error.details || 'No details',
          site_id: window.Pelcro?.site?.read()?.id,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        
        // Send final notification for failed flow
        window.Bugsnag.notify(`Pelcro-React-Elements: Google Login Flow - ${failureType}`, (event) => {
          event.addMetadata("GoogleLoginFlow", {
            flow_id: flowId,
            flow_type: failureType,
            source: "Pelcro-React-Elements",
            component: "GoogleLoginButton",
            failure_type: failureType,
            error: error.message || 'No error message',
            error_code: error.error || 'No error code',
            error_details: error.details || 'No details',
            site_id: window.Pelcro?.site?.read()?.id,
            environment: window.Pelcro?.environment,
            ui_version: window.Pelcro?.uiSettings?.uiVersion,
            user_agent: navigator.userAgent,
            total_steps: 2
          });
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for authentication failure:', error);
    }
    
    // Track Google login failure with ReactGA4 (skip for user-initiated popup close)
    if (failureType !== 'popup_closed_by_user') {
      try {
        const errorMessage = error.message || error.error || 'Unknown error';
        ReactGA4.event('pelcro_google_login_failure', {
          method: 'google',
          source: 'Pelcro-React-Elements',
          component: 'GoogleLoginButton',
          failure_type: failureType,
          error: errorMessage,
          error_code: error.error || 'No error code',
          site_id: window.Pelcro?.site?.read()?.id
        });
      } catch (error) {
        console.warn('GA4 pelcro_google_login_failure event failed:', error);
      }
    }
    
    // Show appropriate error notification based on failure type (skip for user-initiated popup close)
    if (failureType !== 'popup_closed_by_user') {
      const errorMessage = error.message || error.error || 'Unknown error';
      const userFriendlyMessage = getFailureMessage(failureType, errorMessage);
      notify.error(userFriendlyMessage);
    }
  };

  const handleButtonClick = (renderProps) => {
    // Step 0: Button clicked
    const flowId = `google_flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      notifyBugsnag(() => {
        // Set context for this flow
        window.Bugsnag.setContext(`Google Login Flow - ${flowId}`);
        window.Bugsnag.setUser(flowId, null, null);
        
        // Add breadcrumb for button click
        window.Bugsnag.leaveBreadcrumb("Google Button Clicked", {
          step: 0,
          flow_id: flowId,
          source: "Pelcro-React-Elements",
          component: "GoogleLoginButton",
          google_client_id: googleClientId ? 'configured' : 'not-configured',
          site_id: window.Pelcro?.site?.read()?.id,
          url: window.location.href,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
        
        // Send notification for flow start
        window.Bugsnag.notify("Pelcro-React-Elements: Google Login Flow - Started", (event) => {
          event.addMetadata("GoogleLoginFlow", {
            flow_id: flowId,
            flow_type: "started",
            source: "Pelcro-React-Elements",
            component: "GoogleLoginButton",
            google_client_id: googleClientId ? 'configured' : 'not-configured',
            site_id: window.Pelcro?.site?.read()?.id,
            url: window.location.href,
            user_agent: navigator.userAgent,
            total_steps: 0
          });
        });
      });
    } catch (error) {
      console.warn('Failed to send Bugsnag notification for button click:', error);
    }
    
    // Track Google button click with ReactGA4
    try {
      ReactGA4.event('pelcro_google_button_clicked', {
        method: 'google',
        source: 'Pelcro-React-Elements',
        component: 'GoogleLoginButton',
        site_id: window.Pelcro?.site?.read()?.id,
        url: window.location.href
      });
    } catch (error) {
      console.warn('GA4 pelcro_google_button_clicked event failed:', error);
    }
    
    // Call the original onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Call the renderProps onClick
    renderProps.onClick();
  };

  return googleClientId ? (
    <GoogleLogin
      clientId={googleClientId}
      onSuccess={onSuccess}
      onFailure={onFailure}
      render={(renderProps) => (
        <button
          onClick={() => handleButtonClick(renderProps)}
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
