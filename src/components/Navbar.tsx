import React from 'react';
import {
  BookOpen,
  History,
  Settings as SettingsIcon,
  AlertCircle,
  Layers,
  Building2,
  Sparkles,
} from 'lucide-react';
import { AppSettings } from '../types';

interface NavbarProps {
  settings: AppSettings;
  totalSavedCount: number;
  activeView: 'products' | 'brands';
  onSelectView: (view: 'products' | 'brands') => void;
  onOpenRules: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  totalSavedCount,
  activeView,
  onSelectView,
  onOpenRules,
  onOpenHistory,
  onOpenSettings,
}) => {
  const hasKey = Boolean(settings.geminiApiKey);

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
        <div className="flex items-center gap-2.5">
          {/* API Key Status Pill */}
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
                <span className="hidden sm:inline">AI Active ({settings.geminiModel})</span>
                <span className="sm:hidden">AI Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Configure API Key</span>
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
        </div>
      </div>
    </header>
  );
};
