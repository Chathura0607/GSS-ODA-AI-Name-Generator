import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  History,
  Settings as SettingsIcon,
  AlertCircle,
  Layers,
  Building2,
  Sparkles,
  Target,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { AppSettings, AuthUser } from '../types';

interface NavbarProps {
  settings: AppSettings;
  totalSavedCount: number;
  activeView: 'products' | 'brands';
  onSelectView: (view: 'products' | 'brands') => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  activeScopeName?: string;
  onOpenProjectScopes?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  totalSavedCount,
  activeView,
  onSelectView,
  onOpenRules,
  onOpenHistory,
  onOpenSettings,
  activeScopeName = 'Kraft Heinz Germany Project Scope',
  onOpenProjectScopes,
  currentUser,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const hasKey = Boolean(settings.geminiApiKey);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base tracking-tight">
                GSS <span className="text-cyan-400">ODA</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                Analyst Suite
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              AI Product Name Standardizer & Brand Intelligence
            </p>
          </div>
        </div>

        {/* Center Primary Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectView('products')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeView === 'products'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Product Standardizer</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectView('brands')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all relative ${
              activeView === 'brands'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Brand & Logo Hub</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-cyan-400/20 text-cyan-300 font-extrabold border border-cyan-400/30">
              NEW
            </span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Active Project Scope Pill */}
          {onOpenProjectScopes && (
            <button
              type="button"
              onClick={onOpenProjectScopes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-950/80 to-purple-950/80 hover:from-cyan-900/90 hover:to-purple-900/90 text-cyan-300 border border-cyan-500/40 shadow-sm transition-all"
              title="Click to view or change Active Project Scope Matrix"
            >
              <Target className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="hidden xl:inline text-slate-400 font-medium">Scope:</span>
              <span className="truncate max-w-[150px] sm:max-w-[200px]">{activeScopeName}</span>
              <span className="text-[10px] text-cyan-400/70">▼</span>
            </button>
          )}

          {/* Gemini API Key Status Pill */}
          <button
            type="button"
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              hasKey
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20 animate-pulse'
            }`}
          >
            {hasKey ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="hidden sm:inline">Gemini Active ({settings.geminiModel})</span>
                <span className="sm:hidden">Gemini</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure Gemini Key</span>
              </>
            )}
          </button>

          {/* Rules Guide Button */}
          <button
            type="button"
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
            title="View GSS Naming Formula & 49 Container Types"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">GSS Rules Guide</span>
          </button>

          {/* 7-Day History & Vault */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors relative"
            title="Open 7-Day Retention Vault"
          >
            <History className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">7-Day Vault</span>
            {totalSavedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                {totalSavedCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
            title="System & AI Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* User Profile / Gmail Session Pill */}
          {currentUser && (
            <div className="relative pl-1 border-l border-slate-800" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all text-xs"
                title={`Signed in as ${currentUser.email}`}
              >
                {currentUser.picture ? (
                  <img
                    src={currentUser.picture}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-cyan-500/30 shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="hidden lg:block text-left leading-tight">
                  <p className="font-bold text-slate-200 truncate max-w-[110px] text-[11px]">
                    {currentUser.givenName || currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate max-w-[110px]">
                    {currentUser.email}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                    {currentUser.picture ? (
                      <img
                        src={currentUser.picture}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-xl object-cover border border-cyan-500/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs text-white truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Google Verified Analyst
                      </span>
                    </div>
                  </div>

                  <div className="py-2 text-[11px] text-slate-400 space-y-1">
                    <p className="px-1 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                      Workspace Storage
                    </p>
                    <p className="px-1 leading-relaxed text-slate-300">
                      Isolated browser IndexedDB store for this account.
                    </p>
                  </div>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
