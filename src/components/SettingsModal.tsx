import React, { useState } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  Cpu,
  Calendar,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Save,
} from 'lucide-react';
import { AppSettings } from '../types';
import { testGeminiApiKey } from '../services/gemini';
import { saveSettings } from '../services/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [apiKey, setApiKey] = useState(settings.geminiApiKey || '');
  const [model, setModel] = useState(settings.geminiModel || 'gemini-2.0-flash');
  const [retentionDays, setRetentionDays] = useState(settings.retentionDays || 7);
  const [autoProcess, setAutoProcess] = useState(settings.autoProcessOnUpload ?? true);
  const [strictContainer, setStrictContainer] = useState(settings.strictContainerCheck ?? true);

  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter an API Key first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      await testGeminiApiKey(apiKey.trim(), model);
      setTestResult({ success: true, message: 'Gemini API Key is valid and connected!' });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection failed. Please verify your key.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async () => {
    const updated: AppSettings = {
      geminiApiKey: apiKey.trim(),
      geminiModel: model,
      retentionDays: Number(retentionDays),
      autoProcessOnUpload: autoProcess,
      strictContainerCheck: strictContainer,
    };

    localStorage.setItem('gss_gemini_key', apiKey.trim());
    await saveSettings(updated);
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">System & AI Settings</h2>
              <p className="text-xs text-slate-400">Configure your Gemini Vision credentials and data policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh] text-xs">
          {/* API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cyan-400" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 hover:underline"
              >
                Get Free Key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => {
                  setApiKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="AIzaSy..."
                className="w-full pl-3 pr-20 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
              />
              <div className="absolute right-2 top-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                  title={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTesting || !apiKey.trim()}
                  className="px-2 py-0.5 text-[11px] font-medium bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded border border-cyan-500/40 disabled:opacity-40 transition-colors"
                >
                  {isTesting ? 'Testing...' : 'Test'}
                </button>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-2 rounded-lg flex items-center gap-2 text-[11px] ${
                  testResult.success
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Your API Key is stored securely in your browser session/localStorage and is never sent to any intermediary server.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="font-semibold text-white flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              AI Multimodal Vision Engine
            </label>
            <select
              value={['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'].includes(model) ? model : 'custom'}
              onChange={e => {
                if (e.target.value !== 'custom') {
                  setModel(e.target.value);
                }
              }}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Recommended - Free Tier & High Limit)</option>
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Next-Gen Fast & Accurate)</option>
              <option value="gemini-3.6-flash">Gemini 3.6 Flash (Latest Vision Engine)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Complex Reasoning)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
              <option value="custom">Custom Model Name...</option>
            </select>
            {(!['gemini-1.5-flash', 'gemini-2.5-flash', 'gemini-3.6-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'].includes(model) || model === 'custom') && (
              <input
                type="text"
                value={model === 'custom' ? '' : model}
                onChange={e => setModel(e.target.value)}
                placeholder="e.g. gemini-1.5-flash-latest or gemini-3.6-flash"
                className="w-full px-3 py-2 bg-slate-800/80 border border-purple-500/50 rounded-lg text-slate-200 font-mono text-xs focus:outline-none focus:border-purple-400"
              />
            )}
          </div>

          {/* Retention Days */}
          <div className="space-y-2">
            <label className="font-semibold text-white flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                Historical Data Backup Retention
              </span>
              <span className="text-cyan-400 font-mono font-bold">{retentionDays} Days</span>
            </label>
            <input
              type="range"
              min={7}
              max={30}
              step={1}
              value={retentionDays}
              onChange={e => setRetentionDays(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>7 Days (Min GSS SLA)</span>
              <span>14 Days</span>
              <span>30 Days (Max)</span>
            </div>
          </div>

          {/* Switches */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-white text-xs">Auto-process on drop</p>
                <p className="text-[11px] text-slate-400">Immediately start AI analysis when images or archives are uploaded</p>
              </div>
              <input
                type="checkbox"
                checked={autoProcess}
                onChange={e => setAutoProcess(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700 focus:ring-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="font-semibold text-white text-xs">Strict Container Validation</p>
                <p className="text-[11px] text-slate-400">Enforce strict adherence to the 49 allowed GSS container types</p>
              </div>
              <input
                type="checkbox"
                checked={strictContainer}
                onChange={e => setStrictContainer(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-600 bg-slate-800 border-slate-700 focus:ring-cyan-500"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Client-side secure</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
