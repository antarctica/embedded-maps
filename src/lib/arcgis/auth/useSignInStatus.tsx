import type OAuthInfo from '@arcgis/core/identity/OAuthInfo';
import type Portal from '@arcgis/core/portal/Portal';
import { useEffect, useState } from 'react';

import { checkSignInStatus, loadPortal, registerAppWithOAuth } from './utils';

export const SignInStatus = {
  Idle: 'idle',
  Working: 'working',
  SignedOut: 'signedout',
  SignedIn: 'signedin',
  Error: 'error',
} as const;

export type SignInStatus = (typeof SignInStatus)[keyof typeof SignInStatus];

type SignInResolution = {
  appId: string;
  status: SignInStatus;
  portal?: Portal;
};

const useSignInStatus = (appId: string = ''): [SignInStatus, Portal | undefined] => {
  const [resolution, setResolution] = useState<SignInResolution | null>(null);

  useEffect(() => {
    if (!appId) {
      return;
    }
    let cancelled = false;

    // Asynchronous function to handle signing in. setState only runs after the first
    // await, and is inlined here so the linter can see it is never synchronous.
    const checkStatus = async () => {
      try {
        const oauthInfo: OAuthInfo = registerAppWithOAuth(appId);
        const credential = await checkSignInStatus({ portalUrl: oauthInfo.portalUrl });
        if (cancelled) {
          return;
        }
        if (!credential) {
          setResolution({ appId, status: SignInStatus.SignedOut });
          return;
        }

        const loadedPortal: Portal = await loadPortal({ portalUrl: oauthInfo.portalUrl });
        if (cancelled) {
          return;
        }
        setResolution({ appId, status: SignInStatus.SignedIn, portal: loadedPortal });
      } catch (error) {
        console.error('Error checking sign-in status:', error);
        if (!cancelled) {
          setResolution({ appId, status: SignInStatus.Error });
        }
      }
    };

    void checkStatus();

    return () => {
      cancelled = true;
    };
  }, [appId]);

  // Derive the current status from the resolved result for the active appId. While a
  // check is in flight (or appId just changed) the stored resolution no longer
  // matches, so we report Working.
  const isResolved = resolution?.appId === appId;
  const status: SignInStatus = !appId
    ? SignInStatus.Idle
    : isResolved
      ? resolution.status
      : SignInStatus.Working;
  const portal = isResolved ? resolution.portal : undefined;

  return [status, portal];
};

export default useSignInStatus;
