import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Building2,
  Image as ImageIcon,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Layers,
  Globe,
  Trash2,
  FileSpreadsheet,
  RefreshCw,
  Info,
  ShieldCheck,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  ListPlus,
  Play,
  Pause,
  AlertCircle,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { BrandManufacturerInfo, AppSettings } from '../types';
import { lookupBrandManufacturerAndLogo } from '../services/gemini';
import { standardizeManufacturerName, MANUFACTURER_RULE_MAPPINGS } from '../services/validator';
import {
  saveBrandInfo,
  saveBrandInfos,
  getAllBrands,
  deleteBrand,
  clearAllBrands,
} from '../services/db';

interface BrandManufacturerStudioProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  onOpenRules: () => void;
  initialBrandQuery?: string;
}

const PRESET_BRANDS = [
  'Coca-Cola',
  'Dove',
  'Monster Energy',
  'Tru Blu',
  'Fanta',
  'Cascade',
  'Doritos',
  'Cargill Meat Solutions',
  'Seven-Eleven',
  'Parmareggio',
  'Dutch Bakery Group',
  'Pets\' Kitchen',
];

export const BrandManufacturerStudio: React.FC<BrandManufacturerStudioProps> = ({
  settings,
  onOpenSettings,
  onOpenRules,
  initialBrandQuery,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialBrandQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeBrand, setActiveBrand] = useState<BrandManufacturerInfo | null>(null);
  const [brandHistory, setBrandHistory] = useState<BrandManufacturerInfo[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Logo background preview toggle
  const [logoBg, setLogoBg] = useState<'dark' | 'white' | 'checkered'>('checkered');

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Batch Mode State
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchInput, setBatchInput] = useState('');
  const [isBatchRunning, setIsBatchRunning] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });
  const stopBatchRef = useRef(false);

  // Load history from DB on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // If initial query provided, auto search
  useEffect(() => {
    if (initialBrandQuery && initialBrandQuery.trim()) {
      setSearchQuery(initialBrandQuery);
      handleSearch(initialBrandQuery);
    }
  }, [initialBrandQuery]);

  const loadHistory = async () => {
    try {
      const items = await getAllBrands();
      setBrandHistory(items);
      if (!activeBrand && items.length > 0) {
        setActiveBrand(items[0]);
      }
    } catch (err) {
      console.error('Failed to load brand history', err);
    }
  };

  const handleCopyText = async (text: string, key: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  /**
   * Copy Logo Image directly to system clipboard as PNG
   */
  const handleCopyImage = async (imageUrl?: string) => {
    if (!imageUrl) return;
    try {
      // Fetch image and write blob to clipboard
      const res = await fetch(imageUrl, { mode: 'cors' }).catch(() => null);
      if (!res || !res.ok) {
        // Fallback to copying URL if direct blob copy blocked by CORS
        await navigator.clipboard.writeText(imageUrl);
        setCopiedKey('logo-url-fallback');
        setTimeout(() => setCopiedKey(null), 2000);
        return;
      }

      const blob = await res.blob();
      const imageBitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = imageBitmap.width || 400;
      canvas.height = imageBitmap.height || 400;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(imageBitmap, 0, 0);
        canvas.toBlob(async pngBlob => {
          if (pngBlob && navigator.clipboard && (window as any).ClipboardItem) {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ 'image/png': pngBlob }),
            ]);
            setCopiedKey('logo-image');
            setTimeout(() => setCopiedKey(null), 2000);
          } else {
            await navigator.clipboard.writeText(imageUrl);
            setCopiedKey('logo-url-fallback');
            setTimeout(() => setCopiedKey(null), 2000);
          }
        }, 'image/png');
      }
    } catch (err) {
      console.warn('Canvas clipboard copy fallback to URL', err);
      await navigator.clipboard.writeText(imageUrl);
      setCopiedKey('logo-url-fallback');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  /**
   * Download Logo Image as a file
   */
  const handleDownloadLogo = async (brand: BrandManufacturerInfo) => {
    if (!brand.logoUrl) return;
    try {
      const res = await fetch(brand.logoUrl, { mode: 'cors' }).catch(() => null);
      if (res && res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = brand.logoUrl.endsWith('.svg') ? 'svg' : 'png';
        a.download = `${brand.brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_logo.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Fallback: open in new tab
        window.open(brand.logoUrl, '_blank');
      }
    } catch {
      window.open(brand.logoUrl, '_blank');
    }
  };

  /**
   * Search single brand
   */
  const handleSearch = async (brandToSearch?: string) => {
    const brand = (brandToSearch || searchQuery).trim();
    if (!brand) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await lookupBrandManufacturerAndLogo(
        brand,
        settings.geminiApiKey,
        settings.geminiModel
      );

      setActiveBrand(result);
      setBrandHistory(prev => [result, ...prev.filter(b => b.brandName.toLowerCase() !== brand.toLowerCase())]);
      await saveBrandInfo(result);
    } catch (err: any) {
      console.error('Brand lookup error', err);
      setErrorMessage(err?.message || 'Failed to lookup brand manufacturer.');
      // Offline fallback
      const localResult = standardizeManufacturerName(brand);
      const fallbackInfo: BrandManufacturerInfo = {
        id: `brand_${Date.now()}`,
        brandName: brand,
        rawManufacturerName: brand,
        standardizedManufacturerName: localResult.standardized,
        clarificationRuleApplied: localResult.ruleApplied,
        logoUrl: `https://logo.clearbit.com/${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        logoDownloadPageUrl: `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(brand + ' logo')}`,
        brandWebsite: `https://www.${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        country: 'Unknown',
        industry: 'Consumer Goods',
        searchedAt: Date.now(),
      };
      setActiveBrand(fallbackInfo);
      setBrandHistory(prev => [fallbackInfo, ...prev]);
      await saveBrandInfo(fallbackInfo);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Run Batch Lookup
   */
  const handleRunBatch = async () => {
    if (!batchInput.trim()) return;

    const brandList = batchInput
      .split(/[\n,;]+/)
      .map(b => b.trim())
      .filter(Boolean);

    if (brandList.length === 0) return;

    setIsBatchRunning(true);
    stopBatchRef.current = false;
    setBatchProgress({ current: 0, total: brandList.length });

    const newResults: BrandManufacturerInfo[] = [];

    for (let i = 0; i < brandList.length; i++) {
      if (stopBatchRef.current) break;

      const brand = brandList[i];
      setBatchProgress({ current: i + 1, total: brandList.length });

      try {
        if (i > 0 && settings.geminiApiKey) {
          await new Promise(r => setTimeout(r, 1200));
        }

        const result = await lookupBrandManufacturerAndLogo(
          brand,
          settings.geminiApiKey,
          settings.geminiModel
        );

        newResults.push(result);
        setActiveBrand(result);
        setBrandHistory(prev => [result, ...prev.filter(b => b.brandName.toLowerCase() !== brand.toLowerCase())]);
        await saveBrandInfo(result);
      } catch (err) {
        console.warn(`Batch error for brand: ${brand}`, err);
        const local = standardizeManufacturerName(brand);
        const fallback: BrandManufacturerInfo = {
          id: `brand_${Date.now()}_${i}`,
          brandName: brand,
          rawManufacturerName: brand,
          standardizedManufacturerName: local.standardized,
          clarificationRuleApplied: local.ruleApplied,
          logoUrl: `https://logo.clearbit.com/${brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          logoDownloadPageUrl: `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(brand + ' logo')}`,
          country: 'Global',
          industry: 'Consumer Goods',
          searchedAt: Date.now(),
        };
        newResults.push(fallback);
        setBrandHistory(prev => [fallback, ...prev]);
        await saveBrandInfo(fallback);
      }
    }

    setIsBatchRunning(false);
  };

  const handleStopBatch = () => {
    stopBatchRef.current = true;
    setIsBatchRunning(false);
  };

  /**
   * Export brands to Excel
   */
  const handleExportExcel = () => {
    if (brandHistory.length === 0) return;

    const exportRows = brandHistory.map(b => ({
      'Brand Name': b.brandName,
      'Standardized Manufacturer': b.standardizedManufacturerName,
      'Raw Manufacturer Name': b.rawManufacturerName,
      'Rule Applied': b.clarificationRuleApplied || 'None',
      'Logo Direct URL': b.logoUrl || '',
      'Logo Download Page': b.logoDownloadPageUrl || '',
      'Brand Website': b.brandWebsite || '',
      'Manufacturer Website': b.manufacturerWebsite || '',
      'Country': b.country || '',
      'Industry': b.industry || '',
      'Ultimate Parent Company': b.parentCompany || '',
      'Description': b.description || '',
      'Searched Date': new Date(b.searchedAt).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Brand Intelligence');
    XLSX.writeFile(workbook, `GSS_ODA_Brand_Manufacturer_Export_${Date.now()}.xlsx`);
  };

  const handleDeleteItem = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBrandHistory(prev => prev.filter(b => b.id !== id));
    if (activeBrand?.id === id) {
      const remaining = brandHistory.filter(b => b.id !== id);
      setActiveBrand(remaining.length > 0 ? remaining[0] : null);
    }
    await deleteBrand(id);
  };

  const handleClearAllHistory = async () => {
    if (window.confirm('Are you sure you want to clear all brand search history?')) {
      setBrandHistory([]);
      setActiveBrand(null);
      await clearAllBrands();
    }
  };

  const filteredHistory = brandHistory.filter(
    b =>
      b.brandName.toLowerCase().includes(historySearch.toLowerCase()) ||
      b.standardizedManufacturerName.toLowerCase().includes(historySearch.toLowerCase()) ||
      (b.rawManufacturerName && b.rawManufacturerName.toLowerCase().includes(historySearch.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Studio Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-700/80 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 uppercase tracking-wider">
              Step 01 Clarification Active
            </span>
            <span className="text-slate-400 text-xs">Official GSS Rule Engine</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-cyan-400" />
            Brand Manufacturer & Logo Studio
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Instantly discover parent corporations, apply GSS Manufacturer Clarification short forms (Inc, Corp, LLC, Co, Pvt Ltd, etc.), and download high-resolution vector logos.
          </p>
        </div>

        <div className="flex items-center gap-2.5 z-10">
          <button
            type="button"
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800/90 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs font-semibold rounded-xl border border-cyan-500/30 transition-all shadow-md"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            View Step 01 Rules
          </button>
          <button
            type="button"
            onClick={() => setIsBatchMode(!isBatchMode)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all shadow-md ${
              isBatchMode
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <ListPlus className="w-4 h-4" />
            {isBatchMode ? 'Switch to Single Search' : 'Bulk / Batch Mode'}
          </button>
        </div>
      </div>

      {/* Search Input Section */}
      {!isBatchMode ? (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Enter any Brand Name (e.g. Monster Energy, Dove, Coca-Cola, Cargill, Tru Blu, Doritos)..."
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={isLoading || !searchQuery.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all shrink-0"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Searching AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Find Manufacturer & Logo</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Tags */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Quick Suggestions:</span>
            {PRESET_BRANDS.map(brand => (
              <button
                key={brand}
                type="button"
                onClick={() => {
                  setSearchQuery(brand);
                  handleSearch(brand);
                }}
                className="px-2.5 py-1 text-xs bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 rounded-lg transition-all"
              >
                {brand}
              </button>
            ))}
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        /* Batch / Bulk Lookup Area */
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListPlus className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white text-sm">Bulk Brand Lookup (Batch Mode)</h3>
            </div>
            <span className="text-xs text-slate-400">Paste brand names separated by newlines or commas</span>
          </div>

          <textarea
            value={batchInput}
            onChange={e => setBatchInput(e.target.value)}
            disabled={isBatchRunning}
            placeholder="Monster Energy&#10;Dove&#10;Coca-Cola&#10;Tru Blu&#10;Cascade&#10;Fanta&#10;Doritos&#10;Pets' Kitchen"
            rows={4}
            className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-y"
          />

          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {batchProgress.total > 0 && (
                <span>
                  Processing {batchProgress.current} / {batchProgress.total} brands...
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isBatchRunning ? (
                <button
                  type="button"
                  onClick={handleStopBatch}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <Pause className="w-3.5 h-3.5" />
                  Stop Batch
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRunBatch}
                  disabled={!batchInput.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Process All Brands
                </button>
              )}
            </div>
          </div>

          {isBatchRunning && (
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                style={{
                  width: `${(batchProgress.current / (batchProgress.total || 1)) * 100}%`,
                }}
              ></div>
            </div>
          )}
        </div>
      )}

      {/* Active Brand Result Details */}
      {activeBrand && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Logo Showcase Card (5 cols) */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Brand Logo Asset</span>
                </div>
                {/* Backdrop Switcher */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setLogoBg('checkered')}
                    title="Transparent Grid"
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                      logoBg === 'checkered' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoBg('dark')}
                    title="Dark Background"
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                      logoBg === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoBg('white')}
                    title="White Background"
                    className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                      logoBg === 'white' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
                    }`}
                  >
                    White
                  </button>
                </div>
              </div>

              {/* Logo Image Preview Area */}
              <div
                className={`mt-4 h-56 rounded-xl border border-slate-700/60 flex items-center justify-center p-6 relative overflow-hidden transition-all ${
                  logoBg === 'dark'
                    ? 'bg-slate-950'
                    : logoBg === 'white'
                    ? 'bg-white'
                    : 'bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] bg-slate-950'
                }`}
              >
                {activeBrand.logoUrl ? (
                  <img
                    src={activeBrand.logoUrl}
                    alt={`${activeBrand.brandName} Logo`}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md transition-all hover:scale-105 duration-200"
                    onError={e => {
                      (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${activeBrand.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com&sz=128`;
                    }}
                  />
                ) : (
                  <div className="text-center text-slate-500 space-y-1">
                    <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
                    <p className="text-xs">No direct image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons for Logo */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                {/* Download Logo Button */}
                <button
                  type="button"
                  onClick={() => handleDownloadLogo(activeBrand)}
                  className="w-full py-2.5 px-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
                  title="Download Logo to your computer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Logo
                </button>

                {/* Copy Image Button */}
                <button
                  type="button"
                  onClick={() => handleCopyImage(activeBrand.logoUrl)}
                  className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl border flex items-center justify-center gap-1.5 transition-all shadow-md ${
                    copiedKey === 'logo-image' || copiedKey === 'logo-url-fallback'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                  title="Copy image or link to clipboard"
                >
                  {copiedKey === 'logo-image' || copiedKey === 'logo-url-fallback' ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      Copy Logo Image
                    </>
                  )}
                </button>
              </div>

              {/* Copy Logo URL Link */}
              {activeBrand.logoUrl && (
                <button
                  type="button"
                  onClick={() => handleCopyText(activeBrand.logoUrl!, 'logo-url')}
                  className="w-full py-1.5 text-[11px] text-slate-400 hover:text-cyan-300 flex items-center justify-center gap-1 transition-colors"
                >
                  {copiedKey === 'logo-url' ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Logo Image URL Copied
                    </span>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Direct Image URL
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Manufacturer & Links Card (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand Title & Country */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                    Brand Intelligence File
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
                    {activeBrand.brandName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  {activeBrand.country && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-cyan-400" />
                      {activeBrand.country}
                    </span>
                  )}
                  {activeBrand.industry && (
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                      {activeBrand.industry}
                    </span>
                  )}
                </div>
              </div>

              {/* Standardized Manufacturer Box */}
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 shadow-lg space-y-2 relative group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Standardized Manufacturer Name
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    GSS Step 01 Compliant
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xl font-extrabold text-white tracking-tight font-mono selection:bg-cyan-500 selection:text-black">
                    {activeBrand.standardizedManufacturerName}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(activeBrand.standardizedManufacturerName, 'standard-mfg')
                    }
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all shrink-0 ${
                      copiedKey === 'standard-mfg'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white border-cyan-500'
                    }`}
                  >
                    {copiedKey === 'standard-mfg' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Name
                      </>
                    )}
                  </button>
                </div>

                {/* Rule Applied Badge */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">Clarification Applied:</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[11px] font-medium border border-slate-700">
                    {activeBrand.clarificationRuleApplied || 'Direct Name'}
                  </span>
                </div>
              </div>

              {/* Raw vs Standardized Comparison */}
              {activeBrand.rawManufacturerName &&
                activeBrand.rawManufacturerName !== activeBrand.standardizedManufacturerName && (
                  <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs flex items-center justify-between gap-2">
                    <span className="text-slate-400">Original Unshortened Legal Name:</span>
                    <span className="font-mono text-slate-300">{activeBrand.rawManufacturerName}</span>
                  </div>
                )}

              {/* Official Links & Download URLs */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Verified Resource & Download Links
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Official Logo Download / Source Link */}
                  {activeBrand.logoDownloadPageUrl && (
                    <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 block">Logo Download Page</span>
                        <span className="text-xs text-slate-300 truncate block">
                          {activeBrand.logoDownloadPageUrl.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyText(activeBrand.logoDownloadPageUrl!, 'download-page-link')}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-700 transition-colors"
                          title="Copy Link"
                        >
                          {copiedKey === 'download-page-link' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={activeBrand.logoDownloadPageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-cyan-400 hover:text-white bg-cyan-950/60 hover:bg-cyan-600 rounded-lg border border-cyan-800 transition-colors"
                          title="Open in new tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Brand Official Website Link */}
                  {activeBrand.brandWebsite && (
                    <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 block">Official Brand Site</span>
                        <span className="text-xs text-slate-300 truncate block">
                          {activeBrand.brandWebsite.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyText(activeBrand.brandWebsite!, 'brand-website-link')}
                          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-700 transition-colors"
                          title="Copy Link"
                        >
                          {copiedKey === 'brand-website-link' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <a
                          href={activeBrand.brandWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-indigo-400 hover:text-white bg-indigo-950/60 hover:bg-indigo-600 rounded-lg border border-indigo-800 transition-colors"
                          title="Open website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Metadata Footer */}
            {activeBrand.description && (
              <p className="text-xs text-slate-400 italic bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                "{activeBrand.description}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* History Vault Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-white text-base">
              Searched Brands Vault ({brandHistory.length})
            </h3>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              placeholder="Filter vault..."
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-full sm:w-48"
            />
            <button
              type="button"
              onClick={handleExportExcel}
              disabled={brandHistory.length === 0}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md shrink-0"
              title="Export all records to Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel
            </button>
            {brandHistory.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllHistory}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl border border-slate-700 transition-colors"
                title="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-500 space-y-2">
            <Building2 className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs">No brand records found. Type a brand name above to search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-950/40">
                  <th className="py-2.5 px-3">Brand</th>
                  <th className="py-2.5 px-3">Standardized Manufacturer</th>
                  <th className="py-2.5 px-3">Clarification Rule</th>
                  <th className="py-2.5 px-3">Logo</th>
                  <th className="py-2.5 px-3">Links & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredHistory.map(b => (
                  <tr
                    key={b.id}
                    onClick={() => setActiveBrand(b)}
                    className={`cursor-pointer transition-colors ${
                      activeBrand?.id === b.id ? 'bg-cyan-500/10 hover:bg-cyan-500/15' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3 px-3 font-bold text-white whitespace-nowrap">
                      {b.brandName}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-cyan-300">
                      <div className="flex items-center gap-1.5">
                        <span>{b.standardizedManufacturerName}</span>
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleCopyText(b.standardizedManufacturerName, `table-mfg-${b.id}`);
                          }}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Copy manufacturer name"
                        >
                          {copiedKey === `table-mfg-${b.id}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 text-[10px] border border-slate-700">
                        {b.clarificationRuleApplied || 'Direct Name'}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {b.logoUrl && (
                        <div className="w-8 h-8 rounded bg-slate-950 p-1 border border-slate-700 flex items-center justify-center">
                          <img
                            src={b.logoUrl}
                            alt="Logo"
                            className="max-h-full max-w-full object-contain"
                            onError={e => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {b.logoUrl && (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              handleDownloadLogo(b);
                            }}
                            className="p-1.5 text-cyan-400 hover:text-white bg-slate-800 hover:bg-cyan-600 rounded-lg border border-slate-700 transition-colors"
                            title="Download Logo"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {b.logoDownloadPageUrl && (
                          <a
                            href={b.logoDownloadPageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg border border-slate-700 transition-colors"
                            title="Open Logo Download Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={e => handleDeleteItem(b.id, e)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                          title="Delete from vault"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
