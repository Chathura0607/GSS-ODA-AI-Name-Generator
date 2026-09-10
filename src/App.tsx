import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FileUploader } from './components/FileUploader';
import { ProcessingQueue } from './components/ProcessingQueue';
import { ProductTable } from './components/ProductTable';
import { ProductDetailModal } from './components/ProductDetailModal';
import { RulesGuideModal } from './components/RulesGuideModal';
import { HistoryModal } from './components/HistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { BrandManufacturerStudio } from './components/BrandManufacturerStudio';

import { ProcessedProduct, AppSettings } from './types';
import { ExtractedImageFile } from './services/archiveExtractor';
import { analyzeProductImage } from './services/gemini';
import { assembleStandardName, validateStandardName, generateGoogleSkuUrl } from './services/validator';
import {
  saveProduct,
  saveProducts,
  getAllProducts,
  deleteProduct,
  loadSettings,
  purgeOldRecords,
} from './services/db';

import {
  ShieldCheck,
  Layers,
  CheckCircle2,
  AlertTriangle,
  History,
  Building2,
} from 'lucide-react';

export const App: React.FC = () => {
  // Navigation View State
  const [activeView, setActiveView] = useState<'products' | 'brands'>('products');
  const [brandQueryToOpen, setBrandQueryToOpen] = useState<string>('');

  // State
  const [settings, setSettings] = useState<AppSettings>({
    geminiApiKey: localStorage.getItem('gss_gemini_key') || '',
    geminiModel: 'gemini-3.6-flash',
    retentionDays: 7,
    autoProcessOnUpload: true,
    strictContainerCheck: true,
  });

  const [products, setProducts] = useState<ProcessedProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [totalSavedCount, setTotalSavedCount] = useState(0);


  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inspectingProduct, setInspectingProduct] = useState<ProcessedProduct | null>(null);

  // Initial load
  useEffect(() => {
    async function init() {
      try {
        const loaded = await loadSettings();
        setSettings(loaded);

        // Purge records older than retention period (default 7 days)
        await purgeOldRecords(loaded.retentionDays || 7);

        // Load existing products from DB
        const storedProducts = await getAllProducts();
        setProducts(storedProducts);
        setTotalSavedCount(storedProducts.length);
      } catch (err) {
        console.error('Initialization error:', err);
      }
    }
    init();
  }, []);

  // Update total count
  const refreshStats = async () => {
    try {
      const all = await getAllProducts();
      setTotalSavedCount(all.length);
    } catch (err) {
      console.error(err);
    }
  };

  // Analyze a single product item with Gemini Vision
  const analyzeSingle = async (
    item: ProcessedProduct,
    currentApiKey: string,
    currentModel: string
  ): Promise<ProcessedProduct> => {
    try {
      // Set status to analyzing
      const inProgress: ProcessedProduct = { ...item, status: 'analyzing' };
      setProducts(prev => prev.map(p => (p.id === item.id ? inProgress : p)));

      // Call Gemini API
      const result = await analyzeProductImage(item.thumbnailUrl, currentApiKey, currentModel);
      const validation = validateStandardName(result.standardName, result.attributes.containerType);
      const googleSkuUrl = generateGoogleSkuUrl(result.attributes) || undefined;

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
        status: 'queued',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    });

    // Save queued items to state & DB
    setProducts(prev => [...newItems, ...prev]);
    await saveProducts(newItems);
    await refreshStats();

    // If API key is missing, prompt settings modal
    if (!settings.geminiApiKey) {
      setIsSettingsOpen(true);
      return;
    }

    // Process one by one with safe spacing for free-tier rate limits
    setIsProcessing(true);
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      if (i > 0) {
        await new Promise(res => setTimeout(res, 1200));
      }
      const finished = await analyzeSingle(item, settings.geminiApiKey, settings.geminiModel);
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
    const updated = await analyzeSingle(product, settings.geminiApiKey, settings.geminiModel);
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
        await new Promise(res => setTimeout(res, 1200));
      }
      const updated = await analyzeSingle(item, settings.geminiApiKey, settings.geminiModel);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Navbar with Tab Switcher */}
      <Navbar
        settings={settings}
        totalSavedCount={totalSavedCount}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 uppercase tracking-wider">
                      GSS Production Ready
                    </span>
                    <span className="text-slate-400 text-xs">ODA Data Standardization Hub</span>
                  </div>
                  <h1 className="text-xl font-extrabold text-white tracking-tight">
                    Operational Data Product Standardizer
                  </h1>
                  <p className="text-xs text-slate-300 max-w-md">
                    Automating English naming formulas, multi-format archive extraction, and 49-container type classification.
                  </p>
                </div>
                <div className="relative z-10 flex items-center gap-4 pt-4 text-xs text-slate-400 border-t border-slate-700/60 mt-3">
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    7-Day Local Retention
                  </span>
                  <span className="flex items-center gap-1 text-slate-300 font-medium">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    49 GSS Containers
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveView('brands')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium ml-auto"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    Brand & Logo Studio &rarr;
                  </button>
                </div>
              </div>

              {/* Stat 1: Total Active */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Current Products
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{products.length}</span>
                  <span className="text-xs text-slate-500 font-medium">Items Loaded</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  <History className="w-3 h-3 text-purple-400" />
                  <span>{totalSavedCount} in 7-day vault</span>
                </div>
              </div>

              {/* Stat 2: Compliance Rate */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  GSS Rule Compliance
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                    {products.length > 0 ? Math.round((validCount / products.length) * 100) : 100}%
                  </span>
                  <span className="text-xs text-emerald-400 font-medium">{validCount} Perfect</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
                  {warningCount > 0 ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {warningCount} need attention
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      All rules compliant
                    </span>
                  )}
                </div>
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
      />

      <ProductDetailModal
        product={inspectingProduct}
        isOpen={Boolean(inspectingProduct)}
        onClose={() => setInspectingProduct(null)}
        onUpdateProduct={handleUpdateProduct}
        onReanalyze={handleReanalyze}
        onLookupBrand={handleLookupBrand}
      />
    </div>
  );
};

