import React, { useEffect, useRef, useState } from 'react';
import {
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  CheckCircle2,
  Key,
  UserCheck,
  LogIn,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Lock,
} from 'lucide-react';
import { AuthUser, AppSettings } from '../types';
import {
  getGoogleClientId,
  saveGoogleClientId,
  decodeGoogleJwt,
  setStoredUser,
} from '../services/auth';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
  settings: AppSettings;
  onUpdateSettings?: (settings: AppSettings) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  settings,
  onUpdateSettings,
}) => {
  const [clientId, setClientId] = useState<string>(
    getGoogleClientId() || settings.googleClientId || ''
  );
  const [showConfig, setShowConfig] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isGsiReady, setIsGsiReady] = useState(false);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Poll for window.google.accounts.id readiness
  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (window.google?.accounts?.id) {
        setIsGsiReady(true);
        clearInterval(interval);
      } else if (attempts > 30) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Initialize Google Identity Services when ready and clientId is available
  useEffect(() => {
    if (!isGsiReady || !clientId.trim() || !window.google?.accounts?.id) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId.trim(),
        callback: (response: any) => {
          if (response?.credential) {
            try {
              const user = decodeGoogleJwt(response.credential);
              setStoredUser(user);
              onLoginSuccess(user);
            } catch (err: any) {
              setErrorMsg(err.message || 'Failed to decode Google user profile.');
            }
          } else {
            setErrorMsg('Google authentication did not return a credential token.');
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'pill',
          text: 'signin_with',
          logo_alignment: 'left',
          width: 280,
        });
      }

      // Trigger one-tap prompt optionally
      try {
        window.google.accounts.id.prompt();
      } catch (e) {
        // One tap prompt ignored if blocked by browser
      }
    } catch (err: any) {
      console.error('GIS initialization error:', err);
      setErrorMsg('Failed to initialize Google Sign-In with this Client ID.');
    }
  }, [isGsiReady, clientId, onLoginSuccess]);

  const handleSaveClientId = (newId: string) => {
    const trimmed = newId.trim();
    setClientId(trimmed);
    saveGoogleClientId(trimmed);
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, googleClientId: trimmed });
    }
    setShowConfig(false);
    setErrorMsg(null);
  };

  // Instant Guest / Demo Analyst sign-in
  const handleGuestLogin = () => {
    const demoUser: AuthUser = {
      id: `guest-${Date.now()}`,
      name: 'Guest Analyst',
      email: 'analyst@guest.oda',
      givenName: 'Guest',
      familyName: 'Analyst',
      loggedInAt: Date.now(),
    };
    setStoredUser(demoUser);
    onLoginSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-xl shadow-cyan-500/25 mb-4 border border-cyan-400/30">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            GSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">ODA</span> Suite
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            AI-Powered Operational Data Analyst Platform & FMCG Standardization
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-100 flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4 text-cyan-400" />
              Sign in to Continue
            </h2>
            <p className="text-xs text-slate-400">
              Access product name standardizer, brand intelligence, and scope rules
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign-In Button Area */}
          <div className="space-y-4">
            {clientId.trim() ? (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div
                  ref={googleBtnRef}
                  className="min-h-[44px] flex items-center justify-center"
                />
                {!isGsiReady && (
                  <p className="text-[11px] text-slate-500 animate-pulse">
                    Connecting to Google Identity Services...
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 text-center">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/20">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-200">Google Client ID Setup</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    To enable 1-click Google sign-in with your Gmail, enter your Google OAuth Client ID.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfig(!showConfig)}
                  className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md shadow-cyan-500/10"
                >
                  Configure Google Client ID
                </button>
              </div>
            )}

            {/* Google Client ID Configuration Form */}
            {showConfig && (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-700/80 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    Google OAuth Client ID
                  </span>
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    Get Free ID <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                  defaultValue={clientId}
                  id="client-id-input"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById(
                        'client-id-input'
                      ) as HTMLInputElement;
                      if (input) handleSaveClientId(input.value);
                    }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950"
                  >
                    Save & Enable Google Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfig(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold absolute">
                OR
              </span>
            </div>

            {/* Guest / Demo Access Button */}
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm group"
            >
              <UserCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Continue as Guest / Demo Analyst</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform ml-auto" />
            </button>
          </div>

          {/* Quick Features List */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Multi-scope support (Pepsi, P&G, Unilever, Diageo, Kraft Heinz)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Local browser persistence (Private & isolated per user)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Google Gemini Multimodal AI vision analysis</span>
            </div>
          </div>


        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-600 mt-6">
          GSS Operational Data Analyst Suite • Free GitHub & Vercel Deployable
        </p>
      </div>
    </div>
  );
};

