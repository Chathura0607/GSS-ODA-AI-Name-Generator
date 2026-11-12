import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FileUploader } from './components/FileUploader';
import { ProcessingQueue } from './components/ProcessingQueue';
import { ProductTable } from './components/ProductTable';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RulesGuideModal } from './components/RulesGuideModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { ProjectScopeModal } from './components/ProjectScopeModal';
import { BrandManufacturerStudio } from './components/BrandManufacturerStudio';
import { LoginScreen } from './components/LoginScreen';

import { ProcessedProduct, AppSettings, AuthUser } from './types';
import { ProjectScope, PEPSI_DE_SCOPE, PNG_PT_SCOPE, COCA_COLA_ISRAEL_SCOPE, KRAFT_HEINZ_GERMANY_SCOPE, DIAGEO_GR_SCOPE, UNILEVER_PT_SCOPE, UNILEVER_IT_SCOPE, DEFAULT_PROJECT_SCOPES } from './constants/projectScopes';
import { ExtractedImageFile } from './services/archiveExtractor';
import { analyzeProductImage, resolveScopeCategories } from './services/gemini';
import { assembleStandardName, validateStandardName, generateGoogleSkuUrl } from './services/validator';
import { getStoredUser, logoutUser } from './services/auth';
import {
  saveProduct,
  saveProducts,
  getAllProducts,
  deleteProduct,
  loadSettings,
  saveSettings,
  purgeOldRecords,
  getAllProjectScopes,
} from './services/db';

import {
  ShieldCheck,
  Layers,
  CheckCircle2,
  AlertTriangle,
  History,
  Building2,
  Target,
  Sparkles,
} from 'lucide-react';

export const App: React.FC = () => {
  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => getStoredUser());

  // Navigation View State
  const [activeView, setActiveView] = useState<'products' | 'brands'>('products');
  const [brandQueryToOpen, setBrandQueryToOpen] = useState<string>('');

  // State
  const [settings, setSettings] = useState<AppSettings>({
    geminiApiKey: localStorage.getItem('gss_gemini_key') || '',
    geminiModel: 'gemini-3.5-flash',
    retentionDays: 7,
    autoProcessOnUpload: true,
    strictContainerCheck: true,
    activeProjectScopeId: 'kraft-heinz-germany',
  });

  const [scopes, setScopes] = useState<ProjectScope[]>(DEFAULT_PROJECT_SCOPES);
  const [activeScopeId, setActiveScopeId] = useState<string>('kraft-heinz-germany');

  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalSavedCount, setTotalSavedCount] = useState(0);

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScopeModalOpen, setIsScopeModalOpen] = useState(false);
  const [inspectingProduct, setInspectingProduct] = useState<ProcessedProduct | null>(null);

  // Active Scope object
  const activeScope = scopes.find(s => s.id === activeScopeId) || scopes[0] || KRAFT_HEINZ_GERMANY_SCOPE;

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const loadedSettings = await loadSettings();
        setSettings(loadedSettings);
        if (loadedSettings.activeProjectScopeId) {
          setActiveScopeId(loadedSettings.activeProjectScopeId);
        }

        const loadedScopes = await getAllProjectScopes();
        setScopes(loadedScopes);

        // Purge records older than retention period (default 7 days)
        await purgeOldRecords(loadedSettings.retentionDays || 7);

        // Load existing products from DB
        const storedProducts = await getAllProducts();
        const currentActiveScope =
          loadedScopes.find(s => s.id === (loadedSettings.activeProjectScopeId || 'diageo-gr')) ||
          loadedScopes[0] ||
          DIAGEO_GR_SCOPE;

        // Auto-realign existing stored products against active scope rules to fix any false-positive Out of Scope
        const normalizedStored = storedProducts.map(p => {
          const resolved = resolveScopeCategories(
            {
              brand: p.attributes.brand,
              item: p.attributes.item,
              flavorOrVariant: p.attributes.flavorOrVariant,
              scopeCategory: p.scopeCategory || p.attributes.scopeCategory,
              traxCategory: p.traxCategory || p.attributes.traxCategory,
              clientCategory: p.clientCategory || p.attributes.clientCategory,
              smartL1: p.smartL1 || p.attributes.smartL1,
              notes: p.notes,
            },
            currentActiveScope
          );
          return {
            ...p,
            scopeCategory: resolved.scopeCategory,
            traxCategory: resolved.traxCategory,
            clientCategory: resolved.clientCategory,
            smartL1: resolved.smartL1,
            projectScopeName: resolved.projectScopeName || currentActiveScope.name,
            attributes: {
              ...p.attributes,
              scopeCategory: resolved.scopeCategory,
              traxCategory: resolved.traxCategory,
              clientCategory: resolved.clientCategory,
              smartL1: resolved.smartL1,
              projectScopeName: resolved.projectScopeName || currentActiveScope.name,
            },
            notes: resolved.notes || p.notes,
          };
        });

        setProducts(normalizedStored);
        setTotalSavedCount(normalizedStored.length);
        if (normalizedStored.length > 0) {
          await saveProducts(normalizedStored);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    init();
  }, []);

  const refreshScopes = async () => {
    try {
      const loaded = await getAllProjectScopes();
      setScopes(loaded);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectActiveScope = async (scopeId: string) => {
    setActiveScopeId(scopeId);
    const updatedSettings = { ...settings, activeProjectScopeId: scopeId };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);

    // Auto-realign existing products to the newly selected scope
    const targetScope = scopes.find(s => s.id === scopeId);
    if (targetScope && products.length > 0) {
      const updatedProducts = products.map(p => {
        const resolved = resolveScopeCategories(
          {
            brand: p.attributes.brand,
            item: p.attributes.item,
            flavorOrVariant: p.attributes.flavorOrVariant,
            scopeCategory: p.scopeCategory || p.attributes.scopeCategory,
            traxCategory: p.traxCategory || p.attributes.traxCategory,
            clientCategory: p.clientCategory || p.attributes.clientCategory,
            smartL1: p.smartL1 || p.attributes.smartL1,
            notes: p.notes,
          },
          targetScope
        );
        return {
          ...p,
          scopeCategory: resolved.scopeCategory,
          traxCategory: resolved.traxCategory,
          clientCategory: resolved.clientCategory,
          smartL1: resolved.smartL1,
          projectScopeName: resolved.projectScopeName || targetScope.name,
          attributes: {
            ...p.attributes,
            scopeCategory: resolved.scopeCategory,
            traxCategory: resolved.traxCategory,
            clientCategory: resolved.clientCategory,
            smartL1: resolved.smartL1,
            projectScopeName: resolved.projectScopeName || targetScope.name,
          },
          notes: resolved.notes || p.notes,
          updatedAt: Date.now(),
        };
      });
      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
    }
  };

  const handleRealignScope = async () => {
    if (!activeScope || products.length === 0) return;
    const updatedProducts = products.map(p => {
      const resolved = resolveScopeCategories(
        {
          brand: p.attributes.brand,
          item: p.attributes.item,
          flavorOrVariant: p.attributes.flavorOrVariant,
          scopeCategory: p.scopeCategory || p.attributes.scopeCategory,
          traxCategory: p.traxCategory || p.attributes.traxCategory,
          clientCategory: p.clientCategory || p.attributes.clientCategory,
          smartL1: p.smartL1 || p.attributes.smartL1,
          notes: p.notes,
        },
        activeScope
      );
      return {
        ...p,
        scopeCategory: resolved.scopeCategory,
        traxCategory: resolved.traxCategory,
        clientCategory: resolved.clientCategory,
        smartL1: resolved.smartL1,
        projectScopeName: resolved.projectScopeName || activeScope.name,
        attributes: {
          ...p.attributes,
          scopeCategory: resolved.scopeCategory,
          traxCategory: resolved.traxCategory,
          clientCategory: resolved.clientCategory,
          smartL1: resolved.smartL1,
          projectScopeName: resolved.projectScopeName || activeScope.name,
        },
        notes: resolved.notes || p.notes,
        updatedAt: Date.now(),
      };
    });
    setProducts(updatedProducts);
    await saveProducts(updatedProducts);
  };

  // Update total count
  const refreshStats = async () => {
    try {
      const all = await getAllProducts();
      setTotalSavedCount(all.length);
    } catch (err) {
      console.error(err);
    }
  };

  // Analyze a single product item with Google Gemini Vision
  const analyzeSingle = async (
    item: ProcessedProduct,
    currentSettings: AppSettings = settings
  ): Promise<ProcessedProduct> => {
    try {
      // Set status to analyzing
      const inProgress: ProcessedProduct = { ...item, status: 'analyzing' };
      setProducts(prev => prev.map(p => (p.id === item.id ? inProgress : p)));

      // Call Google Gemini Vision with active project scope
      const result = await analyzeProductImage(
        item.thumbnailUrl,
        currentSettings.geminiApiKey,
        currentSettings.geminiModel,
        activeScope
      );
      const validation = validateStandardName(result.standardName, result.attributes.containerType);
      const googleSkuUrl = result.googleSkuUrl || generateGoogleSkuUrl(result.attributes) || undefined;

      const completed: ProcessedProduct = {
        ...item,
        attributes: result.attributes,
        standardName: result.standardName,
        characterCount: result.standardName.length,
        isLengthValid: validation.isLengthValid,
        isContainerValid: validation.isContainerValid,
        isAlphanumericValid: validation.isAlphanumericValid,
        confidenceScore: result.confidenceScore,
        googleSkuUrl,
        exactProductUrl: result.exactProductUrl || result.attributes.exactProductUrl || undefined,
        projectScopeName: result.projectScopeName || result.attributes.projectScopeName || activeScope.name,
        scopeCategory: result.scopeCategory || result.attributes.scopeCategory || undefined,
        traxCategory: result.traxCategory || result.attributes.traxCategory || undefined,
        clientCategory: result.clientCategory || result.attributes.clientCategory || undefined,
        smartL1: result.smartL1 || result.attributes.smartL1 || undefined,
        notes: result.notes,
        status: 'completed',
        updatedAt: Date.now(),
      };

      // Persist immediately in IndexedDB (guaranteeing 7-day retention)
      await saveProduct(completed);
      return completed;
    } catch (err: any) {
      console.error('Analysis error for', item.sourceFileName, err);

      // Smart fallback heuristic for demo/test images if API key is missing or failed
      let fallbackName = item.sourceFileName.replace(/\.[^/.]+$/, '').replace(/[_\\-]/g, ' ');
      const completedWithError: ProcessedProduct = {
        ...item,
        standardName: fallbackName,
        characterCount: fallbackName.length,
        isLengthValid: fallbackName.length <= 150,
        isContainerValid: true,
        isAlphanumericValid: true,
        projectScopeName: activeScope.name,
        status: 'error',
        errorMessage: err?.message || 'Vision analysis failed.',
        updatedAt: Date.now(),
      };

      await saveProduct(completedWithError);
      return completedWithError;
    }
  };

  // Handler when user uploads or drops files
  const handleFilesExtracted = async (extractedFiles: ExtractedImageFile[]) => {
    if (extractedFiles.length === 0) return;

    // Build initial products in 'queued' state
    const newItems: ProcessedProduct[] = extractedFiles.map(file => {
      const defaultAttributes = {
        brand: '',
        subBrand: '',
        item: '',
        flavorOrVariant: '',
        additionalWordings: '',
        containerType: 'Bottle',
        subPackages: '',
        size: '',
        measurementUnit: 'ml',
        valuePacksDescription: '',
        projectScopeName: activeScope.name,
      };
      const initialName = assembleStandardName(defaultAttributes);

      return {
        id: file.id,
        sourceFileName: file.name,
        originalFileType: file.mimeType,
        archiveSource: file.archiveSource,
        thumbnailUrl: file.dataUrl,
        attributes: defaultAttributes,
        standardName: initialName,
        characterCount: initialName.length,
        isLengthValid: true,
        isContainerValid: true,
        isAlphanumericValid: true,
        confidenceScore: 0,
        projectScopeName: activeScope.name,
        status: 'queued',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });

    // Save queued items to state & DB
    setProducts(prev => [...newItems, ...prev]);
    await saveProducts(newItems);
    await refreshStats();

    // If Gemini API key is missing, prompt settings modal
    if (!settings.geminiApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    // Process one by one with safe spacing for free-tier rate limits (15 RPM)
    setIsProcessing(true);
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      if (i > 0) {
        await new Promise(res => setTimeout(res, 1500));
      }
      const finished = await analyzeSingle(item, settings);
      setProducts(prev => prev.map(p => (p.id === finished.id ? finished : p)));
    }
    setIsProcessing(false);
    await refreshStats();
  };

  // Reanalyze an existing item
  const handleReanalyze = async (product: ProcessedProduct) => {
    if (!settings.geminiApiKey) {
      setIsSettingsOpen(true);
      return;
    }
    setIsProcessing(true);
    const updated = await analyzeSingle(product, settings);
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setIsProcessing(false);
    await refreshStats();
  };

  // Reanalyze multiple items (e.g. all failed or selected items)
  const handleReanalyzeMultiple = async (items: ProcessedProduct[]) => {
    if (!settings.geminiApiKey) {
      setIsSettingsOpen(true);
      return;
    }
    setIsProcessing(true);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (i > 0) {
        await new Promise(res => setTimeout(res, 1500));
      }
      const updated = await analyzeSingle(item, settings);
      setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    }
    setIsProcessing(false);
    await refreshStats();
  };

  // Update an existing product
  const handleUpdateProduct = async (updated: ProcessedProduct) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    await saveProduct(updated);
    if (inspectingProduct?.id === updated.id) {
      setInspectingProduct(updated);
    }
    await refreshStats();
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await deleteProduct(id);
    await refreshStats();
  };

  // Delete multiple products
  const handleDeleteMultiple = async (ids: string[]) => {
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
    for (const id of ids) {
      await deleteProduct(id);
    }
    await refreshStats();
  };

  // Retry failed item
  const handleRetry = (item: ProcessedProduct) => {
    handleReanalyze(item);
  };

  // Switch to Brand Studio and auto search brand
  const handleLookupBrand = (brandName: string) => {
    if (!brandName) return;
    setBrandQueryToOpen(brandName);
    setActiveView('brands');
  };

  // Active queue calculation
  const activeQueue = products.filter(p => p.status === 'queued' || p.status === 'analyzing' || p.status === 'extracting');

  // Stats
  const validCount = products.filter(p => p.isLengthValid && p.isContainerValid && p.isAlphanumericValid && p.status === 'completed').length;
  const warningCount = products.filter(p => (!p.isLengthValid || !p.isContainerValid || !p.isAlphanumericValid) && p.status === 'completed').length;

  // Gate app behind Google / Gmail authentication screen
  if (!currentUser) {
    return (
      <LoginScreen
        onLoginSuccess={user => setCurrentUser(user)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navbar with Tab Switcher & Active Project Scope Pill */}
      <Navbar
        settings={settings}
        totalSavedCount={totalSavedCount}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeScopeName={activeScope.name}
        onOpenProjectScopes={() => setIsScopeModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => {
          logoutUser();
          setCurrentUser(null);
        }}
      />

      {/* Main Container - Fluid for Laptops & Desktops */}
      <main className="flex-1 max-w-[1720px] w-full mx-auto px-3 sm:px-5 lg:px-8 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {activeView === 'brands' ? (
          /* Brand Manufacturer & Logo Studio View */
          <BrandManufacturerStudio
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenRules={() => setIsRulesOpen(true)}
            initialBrandQuery={brandQueryToOpen}
          />
        ) : (
          /* Product Name Standardizer View */
          <>
            {/* Welcome & Analytics Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="md:col-span-2 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-950/25 to-slate-900/90 border border-white/[0.08] shadow-2xl relative overflow-hidden flex flex-col justify-between backdrop-blur-xl group">
                {/* Decorative ambient corner glow */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/15 transition-all" />

                <div className="relative z-10 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 text-[10px] font-black border border-indigo-500/30 uppercase tracking-widest">
                      GSS Enterprise Suite
                    </span>
                    <span className="text-slate-400 text-xs font-medium">ODA Data Standardization Hub</span>
                  </div>
                  <h1 className="text-lg sm:text-xl xl:text-2xl font-black text-white tracking-tight">
                    Operational Data Product Standardizer
                  </h1>
                  <p className="text-xs text-slate-300/90 max-w-xl leading-relaxed">
                    Automating strict 150-char English naming formulas, multi-format archive extraction, 49 packaging container classifications, and multi-client scope matrices.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-4 pt-3 sm:pt-4 text-xs text-slate-400 border-t border-white/[0.06] mt-3 sm:mt-4">
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    7-Day Retention Vault
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                    <Layers className="w-4 h-4 text-purple-400" />
                    49 Container Types
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveView('brands')}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 ml-auto transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Brand & Logo Studio &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Stat 1: Total Active */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl flex flex-col justify-between backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Current Batch
                  </span>
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                </div>
                <div className="flex items-baseline justify-between mt-2 sm:mt-3">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">{products.length}</span>
                  <span className="text-xs text-slate-400 font-semibold">Items Loaded</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 sm:mt-3 pt-2.5 sm:pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-purple-400" />
                    <span>{totalSavedCount} in local vault</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">IndexedDB</span>
                </div>
              </div>

              {/* Stat 2: Compliance Rate */}
              <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 border border-white/[0.08] shadow-xl flex flex-col justify-between backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Formula Compliance
                  </span>
                  <span className="text-xs text-emerald-400 font-bold">{validCount} Perfect</span>
                </div>
                <div className="mt-1.5 sm:mt-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                      {products.length > 0 ? Math.round((validCount / products.length) * 100) : 100}%
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">GSS Standard</span>
                  </div>
                  {/* Progress Compliance Bar */}
                  <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden mt-2 border border-white/[0.06]">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
                      style={{
                        width: `${products.length > 0 ? Math.round((validCount / products.length) * 100) : 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5 sm:mt-2 flex items-center gap-1.5">
                  {warningCount > 0 ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      {warningCount} SKU{warningCount > 1 ? 's' : ''} require review
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      100% compliant with GSS rules
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Active Project Scope Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900/90 border border-indigo-500/25 rounded-3xl shadow-xl backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 shadow-md shadow-indigo-500/10">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-black text-indigo-400 tracking-wider">
                      Active Project Scope Matrix
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
                      LIVE RESOLUTION
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5 sm:mt-1">
                    <select
                      value={activeScopeId}
                      onChange={e => handleSelectActiveScope(e.target.value)}
                      className="bg-slate-950 border border-indigo-500/40 rounded-xl px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-400 cursor-pointer shadow-sm hover:border-indigo-400 transition-colors"
                    >
                      {scopes.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.clientName} - {s.country})
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-slate-400 hidden md:inline font-medium">
                      • {activeScope.rules.length} scope rule categories active
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsScopeModalOpen(true)}
                  className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 text-indigo-200 border border-indigo-500/30 transition-all shadow-md hover:scale-[1.02]"
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>View Scope Matrix & Manage</span>
                </button>
              </div>
            </div>

            {/* Upload Zone */}
            <FileUploader
              onFilesExtracted={handleFilesExtracted}
              isProcessing={isProcessing}
            />

            {/* Real-time Queue Progress if active */}
            {activeQueue.length > 0 && (
              <ProcessingQueue
                queue={activeQueue}
                isProcessing={isProcessing}
                onRetry={handleRetry}
                onCancelAll={() => setIsProcessing(false)}
              />
            )}

            {/* Main Product Table */}
            <ProductTable
              products={products}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onDeleteMultiple={handleDeleteMultiple}
              onReanalyze={handleReanalyze}
              onReanalyzeMultiple={handleReanalyzeMultiple}
              onInspect={p => setInspectingProduct(p)}
              onLookupBrand={handleLookupBrand}
              activeScope={activeScope}
              onOpenScopeModal={() => setIsScopeModalOpen(true)}
              onRealignScope={handleRealignScope}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 mt-8 text-center text-xs text-slate-500">
        <p>GSS Operational Data Analyst (ODA) Standardizer • Brand Intelligence Studio • Free Vercel & GitHub Deployable</p>
      </footer>

      {/* Modals */}
      <RulesGuideModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        settings={settings}
        onRestoreOrRefresh={async () => {
          const stored = await getAllProducts();
          setProducts(stored);
          refreshStats();
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={newSettings => setSettings(newSettings)}
        onOpenProjectScopes={() => {
          setIsSettingsOpen(false);
          setIsScopeModalOpen(true);
        }}
      />

      <ProjectScopeModal
        isOpen={isScopeModalOpen}
        onClose={() => setIsScopeModalOpen(false)}
        scopes={scopes}
        activeScopeId={activeScopeId}
        onSelectActiveScope={handleSelectActiveScope}
        onScopesUpdated={refreshScopes}
      />

      <ProductDetailModal
        product={inspectingProduct}
        isOpen={Boolean(inspectingProduct)}
        onClose={() => setInspectingProduct(null)}
        onUpdateProduct={handleUpdateProduct}
        onReanalyze={handleReanalyze}
        onLookupBrand={handleLookupBrand}
        activeScope={activeScope}
        settings={settings}
      />
    </div>
  );
};
