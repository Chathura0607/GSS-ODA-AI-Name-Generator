import { AuthUser } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
          cancel: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

const AUTH_USER_KEY = 'gss_auth_user';
const GOOGLE_CLIENT_ID_KEY = 'gss_google_client_id';

/**
 * Fallback / default Google Client ID
 * Users can also set VITE_GOOGLE_CLIENT_ID in .env or configure in Settings
 */
export function getGoogleClientId(): string {
  return (
    localStorage.getItem(GOOGLE_CLIENT_ID_KEY) ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    ''
  );
}

export function saveGoogleClientId(clientId: string): void {
  const clean = clientId.trim();
  if (clean) {
    localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clean);
  } else {
    localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
  }
}

/**
 * Decode standard Google OAuth2 / OIDC JWT credential payload
 */
export function decodeGoogleJwt(token: string): AuthUser {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      id: parsed.sub || `google-${Date.now()}`,
      name: parsed.name || parsed.email?.split('@')[0] || 'Analyst User',
      email: parsed.email || '',
      picture: parsed.picture,
      givenName: parsed.given_name,
      familyName: parsed.family_name,
      token,
      loggedInAt: Date.now(),
    };
  } catch (err) {
    console.error('Error decoding Google JWT credential:', err);
    throw new Error('Invalid Google credential format.');
  }
}

/**
 * Retrieve the current logged-in user from localStorage
 */
export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/**
 * Persist or clear logged-in user in localStorage
 */
export function setStoredUser(user: AuthUser | null): void {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

/**
 * Log out user and disable Google One Tap auto-select
 */
export function logoutUser(): void {
  setStoredUser(null);
  if (window.google?.accounts?.id) {
    try {
      window.google.accounts.id.disableAutoSelect();
    } catch (e) {
      console.warn('Error disabling auto select:', e);
    }
  }
}

