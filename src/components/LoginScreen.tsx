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
  { name: 'Pepsi Germany', tag: 'Beverages & Snacks', color: 'from-blue-500/20 to-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { name: 'P&G Portugal', tag: 'Personal & Home Care', color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30' },
  { name: 'Unilever Italy & PT', tag: 'FMCG Food & Care', color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30' },
  { name: 'Kraft Heinz DE', tag: 'Grocery & Condiments', color: 'from-red-500/20 to-rose-500/20 text-rose-300 border-rose-500/30' },
  { name: 'Diageo Greece', tag: 'Spirits & RTD', color: 'from-purple-500/20 to-violet-500/20 text-purple-300 border-purple-500/30' },
  { name: 'Coca-Cola Israel', tag: 'Beverage Suite', color: 'from-red-500/20 to-orange-500/20 text-orange-300 border-orange-500/30' },
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
          width: 290,
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between items-center px-4 py-8 sm:py-12 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-100px] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top System Status Bar */}
      <header className="w-full max-w-5xl z-10 flex items-center justify-between pb-6 border-b border-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 border border-cyan-400/30">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-white tracking-tight">
              GSS <span className="text-cyan-400">ODA</span> Suite
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              • Enterprise Edition
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Engine Online</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl z-10 my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Brand Value Proposition & Supported Scopes */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Gen Operational Data Analyst Platform</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Standardize FMCG Products with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">
                Precision AI
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Auto-generate 150-character standard English naming strings, detect 49 packaging container types, and map Trax categories instantly with vision intelligence.
            </p>
          </div>

          {/* Supported Scopes Pills Grid */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pre-Configured Enterprise Scopes
            </span>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {SUPPORTED_SCOPES.map(sc => (
                <div
                  key={sc.name}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-medium bg-gradient-to-r ${sc.color} transition-all hover:scale-105 shadow-sm`}
                >
                  <span className="font-bold">{sc.name}</span>
                  <span className="opacity-75 text-[10px] ml-1.5">({sc.tag})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
              <Cpu className="w-4 h-4 text-cyan-400 mb-1.5" />
              <div className="text-xs font-bold text-slate-200">Gemini 2.0 Flash</div>
              <div className="text-[11px] text-slate-400">High-speed OCR & SKU vision</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
              <Boxes className="w-4 h-4 text-purple-400 mb-1.5" />
              <div className="text-xs font-bold text-slate-200">49 Packaging Types</div>
              <div className="text-[11px] text-slate-400">Bottle, Can, Sachet & more</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-left">
              <Database className="w-4 h-4 text-emerald-400 mb-1.5" />
              <div className="text-xs font-bold text-slate-200">Private Local Vault</div>
              <div className="text-[11px] text-slate-400">7-day client-side retention</div>
            </div>
          </div>
        </div>

        {/* Right Side: Authentication Box */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/25 border border-cyan-300/30">
                <LogIn className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight pt-1">
                Analyst Portal
              </h2>
              <p className="text-xs text-slate-400">
                Sign in with your Google Workspace or Gmail account
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Official Google Sign In Button Container */}
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <div
                  ref={googleBtnRef}
                  className="min-h-[44px] flex items-center justify-center"
                />
                {!isGsiReady && (
                  <div className="flex items-center gap-2 py-2 text-xs text-slate-400 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>Connecting to Google Identity Services...</span>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold absolute">
                  OR
                </span>
              </div>

              {/* Guest / Demo Analyst Sign-In */}
              <button
                type="button"
                onClick={handleGuestLogin}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 flex items-center justify-between transition-all shadow-md group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-white">Continue as Guest Analyst</div>
                    <div className="text-[10px] text-slate-400">Demo access without signing in</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Security Guarantee Pill Badges */}
            <div className="pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Zero Server Uploads • Files processed in your browser</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified Google OAuth 2.0 Single Sign-On</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl z-10 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>GSS Operational Data Analyst (ODA) Standardizer • Brand Intelligence Studio</p>
        <p className="text-[11px] text-slate-600">Enterprise FMCG Scope Architecture • Free GitHub & Vercel Deployable</p>
      </footer>
    </div>
  );
};


