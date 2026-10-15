import React, { useState, useEffect } from 'react';
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
  Zap,
  Target,
  Globe,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AppSettings, AiProvider } from '../types';
import { ProjectScope } from '../constants/projectScopes';
import { testGeminiApiKey, fetchAvailableModels, ModelOption } from '../services/gemini';
import { testKieApiKey, fetchKieModels, DEFAULT_KIE_MODELS, DEFAULT_KIE_BASE_URL } from '../services/kie';
import { testTinyFishApiKey } from '../services/tinyfish';
import { saveSettings, getAllProjectScopes } from '../services/db';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (newSettings: AppSettings) => void;
  onOpenProjectScopes?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenProjectScopes,
}) => {
  // Provider Selection
  const [aiProvider, setAiProvider] = useState<AiProvider>(
    settings.aiProvider || (localStorage.getItem('gss_ai_provider') as any) || 'auto'
  );

  // Gemini State
  const [apiKey, setApiKey] = useState(
    settings.geminiApiKey || localStorage.getItem('gss_gemini_key') || ''
  );
  const [model, setModel] = useState(settings.geminiModel || 'gemini-2.5-flash');
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([]);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // KIE AI State
  const [kieKey, setKieKey] = useState(
    settings.kieApiKey || localStorage.getItem('gss_kie_key') || ''
  );
  const [kieModel, setKieModel] = useState(
    settings.kieModel || localStorage.getItem('gss_kie_model') || 'gpt-4o'
  );
  const [kieBaseUrl, setKieBaseUrl] = useState(
    settings.kieBaseUrl || localStorage.getItem('gss_kie_base_url') || DEFAULT_KIE_BASE_URL
  );
  const [availableKieModels, setAvailableKieModels] = useState<ModelOption[]>([]);
  const [showKieKey, setShowKieKey] = useState(false);
  const [isTestingKie, setIsTestingKie] = useState(false);
  const [kieTestResult, setKieTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showAdvancedKie, setShowAdvancedKie] = useState(false);

  // TinyFish State
  const [tinyFishKey, setTinyFishKey] = useState(
    settings.tinyFishApiKey || localStorage.getItem('gss_tinyfish_key') || ''
  );
  const [useTinyFish, setUseTinyFish] = useState(settings.useTinyFishForSearch ?? true);
  const [showTinyFishKey, setShowTinyFishKey] = useState(false);
  const [isTestingTinyFish, setIsTestingTinyFish] = useState(false);
  const [tinyFishTestResult, setTinyFishTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // General Settings State
  const [retentionDays, setRetentionDays] = useState(settings.retentionDays || 7);
  const [autoProcess, setAutoProcess] = useState(settings.autoProcessOnUpload ?? true);
  const [strictContainer, setStrictContainer] = useState(settings.strictContainerCheck ?? true);
  const [activeScopeId, setActiveScopeId] = useState(settings.activeProjectScopeId || 'kraft-heinz-germany');
  const [availableScopes, setAvailableScopes] = useState<ProjectScope[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-fetch available models and scopes when modal is open
  useEffect(() => {
    if (isOpen) {
      if (apiKey.trim()) {
        fetchAvailableModels(apiKey.trim()).then(models => {
          if (models.length > 0) {
            setAvailableModels(models);
          }
        });
      }
      if (kieKey.trim()) {
        fetchKieModels(kieKey.trim(), kieBaseUrl).then(models => {
          if (models.length > 0) {
            setAvailableKieModels(models);
          }
        });
      }
      getAllProjectScopes().then(scopes => {
        setAvailableScopes(scopes);
      });
    }
  }, [isOpen, apiKey, kieKey, kieBaseUrl]);

  if (!isOpen) return null;

  const handleTestKey = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Please enter a Gemini API Key first.' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGeminiApiKey(apiKey.trim(), model);
      if (res.availableModels.length > 0) {
        setAvailableModels(res.availableModels);
      }
      if (res.activeModel && res.activeModel !== model) {
        setModel(res.activeModel);
      }
      setTestResult({
        success: true,
        message: `Gemini API Key is valid and connected! (Using: ${res.activeModel})`,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Connection failed. Please verify your key.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleTestKie = async () => {
    if (!kieKey.trim()) {
      setKieTestResult({ success: false, message: 'Please enter a KIE AI API Key first.' });
      return;
    }
    setIsTestingKie(true);
    setKieTestResult(null);
    try {
      const res = await testKieApiKey(kieKey.trim(), kieModel, kieBaseUrl);
      if (res.availableModels.length > 0) {
        setAvailableKieModels(res.availableModels);
      }
      if (res.activeModel && res.activeModel !== kieModel) {
        setKieModel(res.activeModel);
      }
      setKieTestResult({
        success: true,
        message: res.message,
      });
    } catch (err: any) {
      setKieTestResult({
        success: false,
        message: err?.message || 'Failed to connect to KIE AI API.',
      });
    } finally {
      setIsTestingKie(false);
    }
  };

  const handleTestTinyFish = async () => {
    if (!tinyFishKey.trim()) {
      setTinyFishTestResult({ success: false, message: 'Please enter a TinyFish API Key first.' });
      return;
    }
    setIsTestingTinyFish(true);
    setTinyFishTestResult(null);
    try {
      const res = await testTinyFishApiKey(tinyFishKey.trim());
      setTinyFishTestResult(res);
    } catch (err: any) {
      setTinyFishTestResult({
        success: false,
        message: err?.message || 'Failed to connect to TinyFish API.',
      });
    } finally {
      setIsTestingTinyFish(false);
    }
  };

  const handleSave = async () => {
    const updated: AppSettings = {
      aiProvider,
      geminiApiKey: apiKey.trim(),
      geminiModel: model,
      kieApiKey: kieKey.trim(),
      kieModel: kieModel.trim(),
      kieBaseUrl: kieBaseUrl.trim() || DEFAULT_KIE_BASE_URL,
      tinyFishApiKey: tinyFishKey.trim(),
      useTinyFishForSearch: useTinyFish,
      retentionDays: Number(retentionDays),
      autoProcessOnUpload: autoProcess,
      strictContainerCheck: strictContainer,
      activeProjectScopeId: activeScopeId,
    };

    localStorage.setItem('gss_ai_provider', aiProvider);
    localStorage.setItem('gss_gemini_key', apiKey.trim());
    localStorage.setItem('gss_gemini_model', model);
    localStorage.setItem('gss_kie_key', kieKey.trim());
    localStorage.setItem('gss_kie_model', kieModel.trim());
    localStorage.setItem('gss_kie_base_url', kieBaseUrl.trim() || DEFAULT_KIE_BASE_URL);
    localStorage.setItem('gss_tinyfish_key', tinyFishKey.trim());

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
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">System & AI Settings</h2>
              <p className="text-xs text-slate-400">
                Configure your KIE AI, Google Gemini Vision credentials, project scope & policies
              </p>
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
          {/* Active Project Scope Setting */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Active Project Scope (Category Auto-Classification)
              </label>
              {onOpenProjectScopes && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenProjectScopes();
                  }}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium underline"
                >
                  Edit Matrix Rules &rarr;
                </button>
              )}
            </div>

            <select
              value={activeScopeId}
              onChange={e => setActiveScopeId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {availableScopes.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.clientName} - {s.country})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Images will automatically classify Trax Category (2nd Col), Client Category (3rd Col), and Smart L1 (4th Col) based on this scope.
            </p>
          </div>

          {/* AI Provider Switcher Bar */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Primary AI Vision Engine
              </span>
              <span className="text-[10px] text-slate-400">Choose preferred provider or Auto-detect</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAiProvider('auto')}
                className={`py-2 px-3 rounded-lg text-center font-bold text-xs transition-all border ${
                  aiProvider === 'auto'
                    ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-cyan-500 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                Auto-Detect
                <span className="block text-[10px] font-normal text-slate-400 mt-0.5">Smart key routing</span>
              </button>

              <button
                type="button"
                onClick={() => setAiProvider('kie')}
                className={`py-2 px-3 rounded-lg text-center font-bold text-xs transition-all border ${
                  aiProvider === 'kie'
                    ? 'bg-gradient-to-r from-cyan-500/30 to-indigo-600/30 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                KIE AI
                <span className="block text-[10px] font-normal text-cyan-400 mt-0.5">100+ Models (GPT-4o)</span>
              </button>

              <button
                type="button"
                onClick={() => setAiProvider('gemini')}
                className={`py-2 px-3 rounded-lg text-center font-bold text-xs transition-all border ${
                  aiProvider === 'gemini'
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                Google Gemini
                <span className="block text-[10px] font-normal text-emerald-400 mt-0.5">Google AI Studio</span>
              </button>
            </div>
          </div>

          {/* KIE AI Section */}
          <div
            className={`p-4 rounded-xl border transition-all space-y-3 ${
              aiProvider === 'kie' || (aiProvider === 'auto' && kieKey.trim())
                ? 'bg-gradient-to-r from-cyan-950/30 via-slate-900 to-indigo-950/20 border-cyan-500/40 shadow-lg shadow-cyan-950/20'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-xs">KIE AI Platform & API Key</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40 uppercase">
                      NEW SUPPORT
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Connect directly to Kie.ai for GPT-4o, Gemini, Claude, and DeepSeek multimodal vision
                  </p>
                </div>
              </div>
              <a
                href="https://kie.ai/api-key"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium hover:underline"
              >
                kie.ai/api-key <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* KIE API Key Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">KIE AI API Key</label>
              <div className="relative">
                <input
                  type={showKieKey ? 'text' : 'password'}
                  value={kieKey}
                  onChange={e => {
                    setKieKey(e.target.value);
                    setKieTestResult(null);
                  }}
                  placeholder="Enter your key from kie.ai/api-key..."
                  className="w-full pl-3 pr-20 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500"
                />
                <div className="absolute right-2 top-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setShowKieKey(!showKieKey)}
                    className="p-1 text-slate-400 hover:text-slate-200"
                    title={showKieKey ? 'Hide key' : 'Show key'}
                  >
                    {showKieKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={handleTestKie}
                    disabled={isTestingKie || !kieKey.trim()}
                    className="px-2 py-0.5 text-[11px] font-medium bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 rounded border border-cyan-500/40 disabled:opacity-40 transition-colors"
                  >
                    {isTestingKie ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>

              {kieTestResult && (
                <div
                  className={`p-2 rounded-lg flex items-center gap-2 text-[11px] ${
                    kieTestResult.success
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}
                >
                  {kieTestResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span>{kieTestResult.message}</span>
                </div>
              )}
            </div>

            {/* KIE Model Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">KIE AI Model</label>
                {availableKieModels.length > 0 && (
                  <span className="text-[10px] text-cyan-400 font-mono">
                    {availableKieModels.length} models detected on your key
                  </span>
                )}
              </div>
              <select
                value={
                  availableKieModels.length > 0
                    ? availableKieModels.some(m => m.id === kieModel)
                      ? kieModel
                      : 'custom'
                    : DEFAULT_KIE_MODELS.some(m => m.id === kieModel)
                    ? kieModel
                    : 'custom'
                }
                onChange={e => {
                  if (e.target.value !== 'custom') {
                    setKieModel(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                {availableKieModels.length > 0 ? (
                  <>
                    {availableKieModels.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                    <option value="custom">Custom Model Name...</option>
                  </>
                ) : (
                  <>
                    {DEFAULT_KIE_MODELS.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                    <option value="custom">Custom Model Name...</option>
                  </>
                )}
              </select>
            </div>

            {/* Advanced Endpoint toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvancedKie(!showAdvancedKie)}
                className="text-[10px] text-slate-400 hover:text-slate-300 flex items-center gap-1 font-medium"
              >
                <span>Advanced KIE AI Base URL</span>
                {showAdvancedKie ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {showAdvancedKie && (
                <div className="mt-2 space-y-1">
                  <input
                    type="text"
                    value={kieBaseUrl}
                    onChange={e => setKieBaseUrl(e.target.value)}
                    placeholder="https://api.kie.ai/openai/v1"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[10px] text-slate-500">
                    Default OpenAI compatible endpoint is https://api.kie.ai/openai/v1
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Google Gemini Section */}
          <div
            className={`p-4 rounded-xl border transition-all space-y-3 ${
              aiProvider === 'gemini' || (aiProvider === 'auto' && apiKey.trim() && !kieKey.trim())
                ? 'bg-gradient-to-r from-emerald-950/20 via-slate-900 to-teal-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-white text-xs">Google Gemini AI Studio</span>
                  <p className="text-[10px] text-slate-400">Direct Google AI Studio generative vision engine</p>
                </div>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium hover:underline"
              >
                aistudio.google.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Google Gemini API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={e => {
                    setApiKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="AIzaSy..."
                  className="w-full pl-3 pr-20 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-emerald-500"
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
                    className="px-2 py-0.5 text-[11px] font-medium bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 rounded border border-emerald-500/40 disabled:opacity-40 transition-colors"
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
            </div>

            {/* Gemini Model Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Gemini Model</label>
                {availableModels.length > 0 && (
                  <span className="text-[10px] text-emerald-400 font-mono">
                    {availableModels.length} models detected on your key
                  </span>
                )}
              </div>
              <select
                value={
                  availableModels.length > 0
                    ? availableModels.some((m: ModelOption) => m.id === model)
                      ? model
                      : 'custom'
                    : [
                        'gemini-2.5-flash',
                        'gemini-2.0-flash',
                        'gemini-1.5-flash',
                        'gemini-1.5-flash-latest',
                        'gemini-1.5-pro',
                        'gemini-1.5-pro-latest',
                        'gemini-3.6-flash',
                      ].includes(model)
                    ? model
                    : 'custom'
                }
                onChange={e => {
                  if (e.target.value !== 'custom') {
                    setModel(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                {availableModels.length > 0 ? (
                  <>
                    {availableModels.map((m: ModelOption) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.id})
                      </option>
                    ))}
                    <option value="custom">Custom Model Name...</option>
                  </>
                ) : (
                  <>
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - Fastest & High Precision)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast & Free Tier Compatible)</option>
                    <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash Latest</option>
                    <option value="gemini-1.5-pro">Gemini 1.5 Pro (Highest Reasoning Depth)</option>
                    <option value="gemini-3.6-flash">Gemini 3.6 Flash</option>
                    <option value="custom">Custom Model Name...</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* TinyFish Web Intelligence Section */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-950/30 via-slate-900 to-slate-900 border border-orange-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-xs">TinyFish AI Web Intelligence</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold bg-orange-500/20 text-orange-300 rounded border border-orange-500/40">
                      LIVE WEB AGENT
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">Powers live web crawling, store URL discovery, and brand intelligence</p>
                </div>
              </div>
              <a
                href="https://agent.tinyfish.ai/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 hover:underline"
              >
                agent.tinyfish.ai <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showTinyFishKey ? 'text' : 'password'}
                value={tinyFishKey}
                onChange={e => {
                  setTinyFishKey(e.target.value);
                  setTinyFishTestResult(null);
                }}
                placeholder="sk-tinyfish-..."
                className="w-full pl-3 pr-20 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-orange-500"
              />
              <div className="absolute right-2 top-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowTinyFishKey(!showTinyFishKey)}
                  className="p-1 text-slate-400 hover:text-slate-200"
                  title={showTinyFishKey ? 'Hide key' : 'Show key'}
                >
                  {showTinyFishKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleTestTinyFish}
                  disabled={isTestingTinyFish || !tinyFishKey.trim()}
                  className="px-2 py-0.5 text-[11px] font-medium bg-orange-600/30 hover:bg-orange-600/50 text-orange-300 rounded border border-orange-500/40 disabled:opacity-40 transition-colors"
                >
                  {isTestingTinyFish ? 'Testing...' : 'Test'}
                </button>
              </div>
            </div>

            {tinyFishTestResult && (
              <div
                className={`p-2 rounded-lg flex items-center gap-2 text-[11px] ${
                  tinyFishTestResult.success
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                }`}
              >
                {tinyFishTestResult.success ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                )}
                <span>{tinyFishTestResult.message}</span>
              </div>
            )}

            <label className="flex items-center justify-between cursor-pointer pt-1 border-t border-slate-800/60 text-[11px]">
              <span className="text-slate-300">Enable TinyFish Web Search & Store URL Discovery</span>
              <input
                type="checkbox"
                checked={useTinyFish}
                onChange={e => setUseTinyFish(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-orange-600 bg-slate-800 border-slate-700 focus:ring-orange-500"
              />
            </label>
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
            <span>Client-side secure & encrypted</span>
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
