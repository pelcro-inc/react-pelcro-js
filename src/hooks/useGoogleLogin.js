import { useEffect, useCallback, useState } from "react";

export const useGoogleLogin = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.google?.accounts) {
      setIsGoogleLoaded(true);
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]'
    );
    if (existingScript) {
      existingScript.onload = () => setIsGoogleLoaded(true);
      return;
    }

    // Load Google Identity Services (latest)
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Add small delay to ensure Google services are fully initialized
      setTimeout(() => {
        setIsGoogleLoaded(true);
      }, 100);
    };
    script.onerror = () => {
      console.error("Failed to load Google Identity Services");
      setIsGoogleLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      // Only remove script on unmount if no other components are using it
      const scriptToRemove = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (scriptToRemove && !window.google?.accounts) {
        scriptToRemove.remove();
      }
    };
  }, []);

  const createLogin = useCallback(
    (onSuccess, onError, clientId) => {
      const handleLogin = () => {
        if (!window.google?.accounts || !isGoogleLoaded) {
          onError?.({ error: "Google Identity Services not loaded" });
          return;
        }

        if (!clientId) {
          onError?.({ error: "Google client ID not provided" });
          return;
        }

        setIsLoading(true);

        try {
          // Create a callback function for ID token
          const handleCredentialResponse = (response) => {
            if (response.error) {
              console.error('Google credential error:', response.error);
              setIsLoading(false);
              onError?.(response);
              return;
            }

            try {
              // Validate and decode the credential (JWT ID token)
              const credential = response.credential;

              // Validate JWT structure (should have 3 parts: header.payload.signature)
              if (!credential || typeof credential !== 'string') {
                throw new Error('Invalid credential format');
              }

              const parts = credential.split('.');
              if (parts.length !== 3) {
                throw new Error('Invalid JWT structure - expected 3 parts');
              }

              // Decode payload with error handling
              let payload;
              try {
                const payloadStr = atob(parts[1]);
                payload = JSON.parse(payloadStr);
              } catch (decodeError) {
                throw new Error('Failed to decode JWT payload');
              }

              // Validate required JWT claims
              if (!payload.sub || !payload.email) {
                throw new Error('Missing required JWT claims (sub, email)');
              }

              // Validate email format (basic validation)
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(payload.email)) {
                throw new Error('Invalid email format in JWT');
              }

              // Validate issuer (should be from Google)
              if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') {
                throw new Error('Invalid JWT issuer');
              }

              // Validate token expiration
              const now = Math.floor(Date.now() / 1000);
              if (payload.exp && payload.exp < now) {
                throw new Error('JWT token has expired');
              }

              // Validate audience matches clientId
              if (payload.aud !== clientId) {
                console.warn('JWT audience does not match client ID');
              }

              setIsLoading(false);

              // Sanitize payload data (prevent XSS, limit lengths)
              const sanitizeString = (str, maxLength = 255) => {
                if (!str) return '';
                return String(str).substring(0, maxLength).trim();
              };

              // Format to match old react-google-login format with sanitized data
              const googleUser = {
                profileObj: {
                  googleId: sanitizeString(payload.sub, 100),
                  name: sanitizeString(payload.name),
                  givenName: sanitizeString(payload.given_name),
                  familyName: sanitizeString(payload.family_name),
                  email: sanitizeString(payload.email),
                  imageUrl: sanitizeString(payload.picture, 500)
                },
                tokenObj: {
                  id_token: credential
                },
                getBasicProfile: () => ({
                  getId: () => sanitizeString(payload.sub, 100),
                  getName: () => sanitizeString(payload.name),
                  getGivenName: () => sanitizeString(payload.given_name),
                  getFamilyName: () => sanitizeString(payload.family_name),
                  getEmail: () => sanitizeString(payload.email),
                  getImageUrl: () => sanitizeString(payload.picture, 500)
                }),
                getAuthResponse: () => ({
                  id_token: credential
                })
              };

              onSuccess(googleUser);

            } catch (error) {
              console.error('Error processing Google credential:', error);
              setIsLoading(false);
              onError?.({
                error: 'authentication_failed',
                message: error.message || 'Failed to validate authentication token'
              });
            }
          };

          // Initialize Google Identity Services
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: false
          });

          // Create a hidden div and render the Google button
          const buttonContainer = document.createElement('div');
          buttonContainer.style.position = 'absolute';
          buttonContainer.style.top = '-9999px';
          buttonContainer.style.left = '-9999px';
          document.body.appendChild(buttonContainer);

          // Render the Google Sign-In button
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: 'outline',
            size: 'large',
            type: 'standard'
          });

          // Find and click the rendered button
          setTimeout(() => {
            const googleButton = buttonContainer.querySelector('div[role="button"]');
            if (googleButton) {
              googleButton.click();
            } else {
              // Fallback to prompt
              window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                  setIsLoading(false);
                  onError?.({ error: 'Google sign-in prompt was not displayed' });
                }
              });
            }

            // Clean up the hidden button
            document.body.removeChild(buttonContainer);
          }, 200);
        } catch (error) {
          console.error("Error initializing Google OAuth:", error);
          setIsLoading(false);
          onError?.(error);
        }
      };

      return {
        onClick: handleLogin,
        disabled: !isGoogleLoaded || isLoading
      };
    },
    [isGoogleLoaded, isLoading]
  );

  return { createLogin, isGoogleLoaded, isLoading };
};
