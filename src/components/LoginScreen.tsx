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
  ChevronRight,
  Database,
  Lock,
  Boxes,
  Zap,
  Globe2,
  Cpu,
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

const SUPPORTED_SCOPES = [
  { name: 'Pepsi Germany', tag: 'Beverages & Snacks', color: 'from-blue-600/20 to-indigo-600/20 text-blue-300 border-blue-500/30' },
  { name: 'P&G Portugal', tag: 'Personal Care', color: 'from-amber-600/20 to-orange-600/20 text-amber-300 border-amber-500/30' },
  { name: 'Unilever Italy & PT', tag: 'FMCG Food & Care', color: 'from-emerald-600/20 to-teal-600/20 text-emerald-300 border-emerald-500/30' },
  { name: 'Kraft Heinz DE', tag: 'Grocery & Condiments', color: 'from-rose-600/20 to-red-600/20 text-rose-300 border-rose-500/30' },
  { name: 'Diageo Greece', tag: 'Spirits & RTD', color: 'from-purple-600/20 to-violet-600/20 text-purple-300 border-purple-500/30' },
  { name: 'Coca-Cola Israel', tag: 'Beverage Suite', color: 'from-red-600/20 to-amber-600/20 text-amber-300 border-red-500/30' },
];

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  settings,
}) => {
  const [clientId] = useState<string>(
    getGoogleClientId() || settings.googleClientId || ''
  );
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
      } else if (attempts > 35) {
        clearInterval(interval);
      }
    }, 150);

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
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-[#080C14] flex flex-col justify-between items-center px-4 py-3 sm:py-5 lg:py-4 relative overflow-y-auto lg:overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glows with indigo & violet luxury tones */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-violet-600/10 to-transparent rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 -left-28 w-[380px] h-[380px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[420px] h-[420px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top System Status Bar */}
      <header className="w-full max-w-6xl z-10 flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 border border-indigo-400/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-white tracking-tight">
              GSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">ODA</span> Suite
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              • Enterprise Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Engine Online</span>
          </div>
        </div>
      </header>

      {/* Main Container - Balanced for Laptops & Desktops */}
      <main className="w-full max-w-6xl z-10 my-auto py-3 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center shrink-0">
        {/* Left Side: Brand Value Proposition & Supported Scopes */}
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Operational Data Analyst Platform</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Standardize FMCG Products with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400">
                Precision AI
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Auto-generate 150-character standard English naming strings, classify 49 packaging container types, and map Trax/Client categories automatically.
            </p>
          </div>

          {/* Supported Scopes Pills Grid */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Active Enterprise Project Scopes
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
              {SUPPORTED_SCOPES.map(sc => (
                <div
                  key={sc.name}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium bg-gradient-to-r ${sc.color} transition-all hover:scale-105 shadow-sm`}
                >
                  <span className="font-bold">{sc.name}</span>
                  <span className="opacity-75 text-[10px] ml-1">({sc.tag})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Feature Badges */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/[0.06] text-left">
              <Cpu className="w-4 h-4 text-indigo-400 mb-1" />
              <div className="text-xs font-bold text-slate-200">Gemini 2.0</div>
              <div className="text-[10px] text-slate-400 leading-tight">Vision OCR & SKU extraction</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/[0.06] text-left">
              <Boxes className="w-4 h-4 text-purple-400 mb-1" />
              <div className="text-xs font-bold text-slate-200">49 Packaging</div>
              <div className="text-[10px] text-slate-400 leading-tight">Bottle, Can, Sachet, Pack</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/70 border border-white/[0.06] text-left">
              <Database className="w-4 h-4 text-emerald-400 mb-1" />
              <div className="text-xs font-bold text-slate-200">7-Day Vault</div>
              <div className="text-[10px] text-slate-400 leading-tight">Private local IndexedDB</div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Box */}
        <div className="lg:col-span-5 w-full max-w-sm mx-auto">
          <div className="glass-panel-glow rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4">
            <div className="text-center space-y-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
                <LogIn className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight pt-1">
                Analyst Portal
              </h2>
              <p className="text-xs text-slate-400">
                Sign in with your Google account
              </p>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Official Google Sign In Button Container */}
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-950/80 border border-white/[0.08]">
                <div
                  ref={googleBtnRef}
                  className="min-h-[44px] flex items-center justify-center"
                />
                {!isGsiReady && (
                  <div className="flex items-center gap-2 py-1 text-xs text-slate-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>Connecting to Google Identity Services...</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#0D1321] px-2.5 text-[10px] text-slate-500 uppercase tracking-widest font-bold absolute">
                  OR
                </span>
              </div>

              {/* Guest / Demo Analyst Sign-In */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-2.5 px-3.5 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-850 border border-white/[0.08] hover:border-indigo-500/40 text-slate-200 flex items-center justify-between transition-all shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/25 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Continue as Guest Analyst</div>
                    <div className="text-[10px] text-slate-400">Instant access without signing in</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Security Guarantee Pill Badges */}
            <div className="pt-3 border-t border-white/[0.06] space-y-1.5">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span>Zero Server Uploads • Processed in browser</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Google OAuth 2.0 Single Sign-On</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl z-10 pt-2.5 border-t border-white/[0.06] text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0">
        <p>GSS Operational Data Analyst (ODA) Standardizer • Brand Studio</p>
        <p className="text-slate-600">Enterprise FMCG Scope Architecture • Free GitHub & Vercel Deployable</p>
      </footer>
    </div>
  );
};


