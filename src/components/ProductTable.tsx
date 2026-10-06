import React, { useState } from 'react';
import {
  Copy,
  Check,
  Trash2,
  Sparkles,
  Maximize2,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  FileSpreadsheet,
  CheckSquare,
  Square,
  ExternalLink,
  Link2,
  Building2,
  Target,
  Layers,
  SlidersHorizontal,
} from 'lucide-react';
import { ProcessedProduct, ProductAttributes } from '../types';
import { ContainerTypeSelect } from './ContainerTypeSelect';
import {
  ProjectScope,
  getUniqueTraxCategories,
  getClientCategoriesForTrax,
  getSmartL1Options,
} from '../constants/projectScopes';
import {
  assembleStandardName,
  validateStandardName,
  generateGoogleSkuUrl,
  getSkuLinkInfo,
} from '../services/validator';
import { exportToExcel } from '../services/excelExport';

interface ProductTableProps {
  products: ProcessedProduct[];
  onUpdateProduct: (product: ProcessedProduct) => void;
  onDeleteProduct: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onReanalyze: (product: ProcessedProduct) => void;
  onReanalyzeMultiple?: (products: ProcessedProduct[]) => void;
  onInspect: (product: ProcessedProduct) => void;
  onLookupBrand?: (brand: string) => void;
  activeScope?: ProjectScope | null;
  onOpenScopeModal?: () => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteMultiple,
  onReanalyze,
  onReanalyzeMultiple,
  onInspect,
  onLookupBrand,
  activeScope,
  onOpenScopeModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterValid, setFilterValid] = useState<'all' | 'valid' | 'warning' | 'error' | 'scoped'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSkuId, setCopiedSkuId] = useState<string | null>(null);
  const [bulkCopied, setBulkCopied] = useState(false);
  const [columnView, setColumnView] = useState<'all' | 'scope_matrix' | 'formula'>('all');

  const failedProducts = products.filter(p => p.status === 'error');

  // Filter products
  const filteredProducts = products.filter(p => {
    const term = search.toLowerCase();
    const trax = (p.traxCategory || p.attributes.traxCategory || '').toLowerCase();
    const client = (p.clientCategory || p.attributes.clientCategory || '').toLowerCase();
    const smart = (p.smartL1 || p.attributes.smartL1 || '').toLowerCase();
    const scope = (p.scopeCategory || p.attributes.scopeCategory || '').toLowerCase();

    const matchesSearch =
      p.standardName.toLowerCase().includes(term) ||
      p.attributes.brand.toLowerCase().includes(term) ||
      p.attributes.item.toLowerCase().includes(term) ||
      p.attributes.flavorOrVariant.toLowerCase().includes(term) ||
      p.sourceFileName.toLowerCase().includes(term) ||
      trax.includes(term) ||
      client.includes(term) ||
      smart.includes(term) ||
      scope.includes(term);

    if (!matchesSearch) return false;

    if (filterValid === 'valid') return p.status === 'completed' && p.isLengthValid && p.isContainerValid && p.isAlphanumericValid;
    if (filterValid === 'warning') return !p.isLengthValid || !p.isContainerValid || !p.isAlphanumericValid;
    if (filterValid === 'error') return p.status === 'error';
    if (filterValid === 'scoped') return Boolean(p.traxCategory || p.attributes.traxCategory || p.clientCategory || p.attributes.clientCategory);
    return true;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCopyOne = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleCopySku = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedSkuId(id);
    setTimeout(() => setCopiedSkuId(null), 1800);
  };

  const handleBulkCopy = () => {
    const selectedItems = products.filter(p => selectedIds.includes(p.id));
    const textToCopy = selectedItems.map(p => p.standardName).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setBulkCopied(true);
    setTimeout(() => setBulkCopied(false), 2000);
  };

  const handleFieldChange = (
    product: ProcessedProduct,
    field: keyof ProductAttributes,
    val: string
  ) => {
    const updatedAttributes = { ...product.attributes, [field]: val };
    const standardName = assembleStandardName(updatedAttributes);
    const validation = validateStandardName(standardName, updatedAttributes.containerType);
    const googleSkuUrl = generateGoogleSkuUrl(updatedAttributes) || undefined;

    const updated: ProcessedProduct = {
      ...product,
      attributes: updatedAttributes,
      standardName,
      characterCount: standardName.length,
      isLengthValid: validation.isLengthValid,
      isContainerValid: validation.isContainerValid,
      isAlphanumericValid: validation.isAlphanumericValid,
      googleSkuUrl,
      projectScopeName: updatedAttributes.projectScopeName,
      scopeCategory: updatedAttributes.scopeCategory,
      traxCategory: updatedAttributes.traxCategory,
      clientCategory: updatedAttributes.clientCategory,
      smartL1: updatedAttributes.smartL1,
      updatedAt: Date.now(),
    };

    onUpdateProduct(updated);
  };

  const traxList = activeScope ? getUniqueTraxCategories(activeScope) : [];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800/40 border border-slate-700/80 rounded-2xl">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, brand, Trax, Client category, Smart L1..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterValid}
              onChange={e => setFilterValid(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="all">All Products ({products.length})</option>
              <option value="scoped">🎯 With Project Scope Matrix</option>
              <option value="valid">100% Rule Valid Only</option>
              <option value="warning">Has Rule Warnings</option>
              {failedProducts.length > 0 && (
                <option value="error">⚠️ Failed Analysis ({failedProducts.length})</option>
              )}
            </select>
          </div>

          {/* Column View Mode Switcher */}
          <div className="hidden lg:flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700 text-[11px]">
            <button
              type="button"
              onClick={() => setColumnView('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                columnView === 'all'
                  ? 'bg-cyan-600/30 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Columns
            </button>
            <button
              type="button"
              onClick={() => setColumnView('scope_matrix')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                columnView === 'scope_matrix'
                  ? 'bg-purple-600/30 text-purple-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 Scope Matrix (Col 2/3/4)
            </button>
            <button
              type="button"
              onClick={() => setColumnView('formula')}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                columnView === 'formula'
                  ? 'bg-cyan-600/30 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔤 GSS Formula Only
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {failedProducts.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (onReanalyzeMultiple) {
                  onReanalyzeMultiple(failedProducts);
                } else {
                  failedProducts.forEach(p => onReanalyze(p));
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors shadow-lg shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              ⚡ Retry Failed AI ({failedProducts.length})
            </button>
          )}

          {selectedIds.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => {
                  const selected = products.filter(p => selectedIds.includes(p.id));
                  if (onReanalyzeMultiple) {
                    onReanalyzeMultiple(selected);
                  } else {
                    selected.forEach(p => onReanalyze(p));
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Re-run AI ({selectedIds.length})
              </button>

              <button
                type="button"
                onClick={handleBulkCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition-colors"
              >
                {bulkCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {bulkCopied ? 'Copied Names' : `Copy Selected (${selectedIds.length})`}
              </button>

              <button
                type="button"
                onClick={() => {
                  const selected = products.filter(p => selectedIds.includes(p.id));
                  exportToExcel(selected, 'GSS_ODA_Selected');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Export Selected
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm(`Delete ${selectedIds.length} selected items?`)) {
                    onDeleteMultiple(selectedIds);
                    setSelectedIds([]);
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <button
              type="button"
              onClick={() => exportToExcel(filteredProducts, 'GSS_ODA_Active_Batch')}
              disabled={filteredProducts.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export Excel (With Scope Columns)
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-white"
                  >
                    {selectedIds.length > 0 && selectedIds.length === filteredProducts.length ? (
                      <CheckSquare className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3 w-16 text-center">Image</th>
                <th className="p-3 min-w-[280px]">Standardized English Product Name</th>

                {/* Scope Matrix Columns (Col 2, Col 3, Col 4) */}
                {(columnView === 'all' || columnView === 'scope_matrix') && (
                  <>
                    <th className="p-3 min-w-[150px] text-cyan-300 bg-cyan-950/20 border-l border-r border-cyan-500/20">
                      2nd Col: Trax Category
                    </th>
                    <th className="p-3 min-w-[150px] text-purple-300 bg-purple-950/20 border-r border-purple-500/20">
                      3rd Col: Client Category
                    </th>
                    <th className="p-3 min-w-[180px] text-emerald-300 bg-emerald-950/20 border-r border-emerald-500/20">
                      Last Col: Smart L1
                    </th>
                  </>
                )}

                {/* Standard Formula Columns */}
                {(columnView === 'all' || columnView === 'formula') && (
                  <>
                    <th className="p-3 min-w-[120px]">Brand</th>
                    <th className="p-3 min-w-[120px]">Item (Type)</th>
                    <th className="p-3 min-w-[130px]">Flavor / Scent</th>
                    <th className="p-3 min-w-[150px]">Container</th>
                    <th className="p-3 min-w-[90px]">Pack</th>
                    <th className="p-3 min-w-[100px]">Size & Unit</th>
                  </>
                )}

                <th className="p-3 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnView === 'all' ? 13 : columnView === 'scope_matrix' ? 7 : 10}
                    className="p-8 text-center text-slate-500"
                  >
                    No products matching current filter. Upload product images or clear search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const isSelected = selectedIds.includes(p.id);
                  const isNameOverLimit = p.characterCount > 150;
                  const skuInfo = getSkuLinkInfo(p);

                  const currentTrax = p.traxCategory || p.attributes.traxCategory || '';
                  const currentClient = p.clientCategory || p.attributes.clientCategory || '';
                  const currentSmart = p.smartL1 || p.attributes.smartL1 || '';
                  const currentScopeGroup = p.scopeCategory || p.attributes.scopeCategory || '';

                  // Dynamic client and smart options based on current row selections
                  const clientOptions = activeScope ? getClientCategoriesForTrax(activeScope, currentTrax) : [];
                  const smartOptions = activeScope ? getSmartL1Options(activeScope, currentTrax, currentClient) : [];

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isSelected ? 'bg-cyan-500/5' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(p.id)}
                          className="text-slate-400 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-cyan-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Image Thumbnail with zoom trigger */}
                      <td className="p-3 text-center">
                        <div
                          onClick={() => onInspect(p)}
                          className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-950 border border-slate-700/80 mx-auto cursor-pointer group"
                          title="Click to inspect side-by-side"
                        >
                          <img
                            src={p.thumbnailUrl}
                            alt={p.sourceFileName}
                            className="w-full h-full object-contain p-0.5 group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Maximize2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        </div>
                      </td>

                      {/* Standard Name with validation badges & copy */}
                      <td className="p-3">
                        <div className="space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-mono font-medium text-slate-100 text-xs leading-snug break-words">
                              {p.standardName}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyOne(p.id, p.standardName)}
                              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 shrink-0 border border-slate-700 transition-colors"
                              title="Copy name to clipboard"
                            >
                              {copiedId === p.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Error / Analyzing Status Notice */}
                          {p.status === 'error' && (
                            <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px]">
                              <div className="flex items-center gap-1 min-w-0 truncate" title={p.errorMessage || 'AI Analysis Failed'}>
                                <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                                <span className="truncate">AI Failed: {p.errorMessage || 'Check Key / Model'}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => onReanalyze(p)}
                                className="px-1.5 py-0.5 rounded bg-rose-600/40 hover:bg-rose-600/70 text-white font-semibold text-[10px] shrink-0 transition-colors"
                              >
                                Retry
                              </button>
                            </div>
                          )}

                          {p.status === 'analyzing' && (
                            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] animate-pulse">
                              <Sparkles className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />
                              <span>Analyzing image with AI & mapping scope...</span>
                            </div>
                          )}

                          {/* Scope Badges in compact mode */}
                          {currentSmart && columnView === 'formula' && (
                            <div className="flex items-center gap-1 flex-wrap text-[10px]">
                              <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                                Trax: {currentTrax}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                                Client: {currentClient}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                                {currentSmart}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                                isNameOverLimit
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {p.characterCount} / 150
                            </span>

                            {p.status === 'completed' && p.confidenceScore > 0 && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
                                {p.confidenceScore}% AI Confidence
                              </span>
                            )}

                            {p.isAlphanumericValid ? (
                              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" />
                                Alphanumeric
                              </span>
                            ) : (
                              <span className="text-[10px] text-amber-400 flex items-center gap-0.5" title="Contains special characters">
                                <AlertTriangle className="w-3 h-3" />
                                Symbols Flagged
                              </span>
                            )}
                          </div>

                          {/* Exact Product SKU / Web URL Link */}
                          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                            {skuInfo.url ? (
                              <div
                                className={`inline-flex items-center gap-1.5 border rounded-md px-2 py-0.5 ${
                                  skuInfo.isDirectProductPage
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                    : 'bg-slate-800/90 border-slate-700 text-cyan-300'
                                }`}
                              >
                                {skuInfo.isDirectProductPage && (
                                  <span className="text-[10px] font-bold px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                                    {skuInfo.domainName}
                                  </span>
                                )}

                                <button
                                  type="button"
                                  onClick={() => handleCopySku(p.id, skuInfo.url!)}
                                  className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                                    skuInfo.isDirectProductPage
                                      ? 'text-emerald-300 hover:text-white'
                                      : 'text-cyan-300 hover:text-white'
                                  }`}
                                  title={`Copy link: ${skuInfo.url}`}
                                >
                                  {copiedSkuId === p.id ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-300 font-semibold">Copied SKU Link</span>
                                    </>
                                  ) : (
                                    <>
                                      <Link2 className="w-3 h-3 text-current" />
                                      <span>{skuInfo.isDirectProductPage ? 'Copy Product Link' : 'Copy SKU Link'}</span>
                                    </>
                                  )}
                                </button>
                                <span className="text-slate-600">|</span>
                                <a
                                  href={skuInfo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-0.5 text-[11px] text-slate-400 hover:text-white transition-colors"
                                  title={`Open ${skuInfo.domainName} in new tab`}
                                >
                                  <span>{skuInfo.isDirectProductPage ? 'Open Site' : 'Google'}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                                <AlertTriangle className="w-3 h-3 text-amber-400" />
                                Can't find proper SKU
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Scope Matrix: 2nd Col (Trax Category) */}
                      {(columnView === 'all' || columnView === 'scope_matrix') && (
                        <td className="p-3 bg-cyan-950/10 border-l border-r border-cyan-500/10">
                          {traxList.length > 0 ? (
                            <select
                              value={currentTrax}
                              onChange={e => handleFieldChange(p, 'traxCategory', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-cyan-500/40 rounded text-xs text-cyan-300 font-semibold focus:border-cyan-400 focus:outline-none"
                            >
                              <option value="">Select Trax...</option>
                              {traxList.map(t => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={currentTrax}
                              onChange={e => handleFieldChange(p, 'traxCategory', e.target.value)}
                              placeholder="Trax Category"
                              className="w-full px-2 py-1 bg-slate-900 border border-cyan-500/40 rounded text-xs text-cyan-300 font-semibold focus:border-cyan-400 focus:outline-none"
                            />
                          )}
                          {currentScopeGroup && (
                            <span className="block text-[10px] text-slate-400 truncate mt-1">
                              {currentScopeGroup}
                            </span>
                          )}
                        </td>
                      )}

                      {/* Scope Matrix: 3rd Col (Client Category) */}
                      {(columnView === 'all' || columnView === 'scope_matrix') && (
                        <td className="p-3 bg-purple-950/10 border-r border-purple-500/10">
                          {clientOptions.length > 0 ? (
                            <select
                              value={currentClient}
                              onChange={e => handleFieldChange(p, 'clientCategory', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-purple-500/40 rounded text-xs text-purple-300 font-semibold focus:border-purple-400 focus:outline-none"
                            >
                              <option value="">Select Client...</option>
                              {clientOptions.map(c => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={currentClient}
                              onChange={e => handleFieldChange(p, 'clientCategory', e.target.value)}
                              placeholder="Client Category"
                              className="w-full px-2 py-1 bg-slate-900 border border-purple-500/40 rounded text-xs text-purple-300 font-semibold focus:border-purple-400 focus:outline-none"
                            />
                          )}
                        </td>
                      )}

                      {/* Scope Matrix: Last Col (Smart L1) */}
                      {(columnView === 'all' || columnView === 'scope_matrix') && (
                        <td className="p-3 bg-emerald-950/10 border-r border-emerald-500/10">
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={currentSmart}
                              onChange={e => handleFieldChange(p, 'smartL1', e.target.value)}
                              placeholder="e.g. Ketchup, BBQ Sauce"
                              className="w-full px-2 py-1 bg-slate-900 border border-emerald-500/40 rounded text-xs text-emerald-300 font-medium focus:border-emerald-400 focus:outline-none"
                            />
                            {smartOptions.length > 0 && (
                              <select
                                value=""
                                onChange={e => {
                                  if (e.target.value) handleFieldChange(p, 'smartL1', e.target.value);
                                }}
                                className="w-full px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-400 focus:outline-none focus:border-emerald-400"
                              >
                                <option value="">Pick from {smartOptions.length} template options...</option>
                                {smartOptions.map(s => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        </td>
                      )}

                      {/* Standard Formula Columns */}
                      {(columnView === 'all' || columnView === 'formula') && (
                        <>
                          {/* Brand */}
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={p.attributes.brand}
                                onChange={e => handleFieldChange(p, 'brand', e.target.value)}
                                className="w-full px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                                placeholder="Brand"
                              />
                              {p.attributes.brand && onLookupBrand && (
                                <button
                                  type="button"
                                  onClick={() => onLookupBrand(p.attributes.brand)}
                                  className="p-1 rounded bg-slate-800 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-colors shrink-0"
                                  title={`Lookup manufacturer & logo for "${p.attributes.brand}"`}
                                >
                                  <Building2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Item */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={p.attributes.item}
                              onChange={e => handleFieldChange(p, 'item', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                            />
                          </td>

                          {/* Flavor */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={p.attributes.flavorOrVariant}
                              onChange={e => handleFieldChange(p, 'flavorOrVariant', e.target.value)}
                              className="w-full px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                            />
                          </td>

                          {/* Container Type */}
                          <td className="p-3">
                            <ContainerTypeSelect
                              value={p.attributes.containerType}
                              onChange={val => handleFieldChange(p, 'containerType', val)}
                              className="w-full"
                            />
                          </td>

                          {/* Sub Packages */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={p.attributes.subPackages}
                              onChange={e => handleFieldChange(p, 'subPackages', e.target.value)}
                              placeholder="e.g. 12 Pack"
                              className="w-full px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                            />
                          </td>

                          {/* Size & Unit */}
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={p.attributes.size}
                                onChange={e => handleFieldChange(p, 'size', e.target.value)}
                                className="w-14 px-1.5 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                              />
                              <input
                                type="text"
                                value={p.attributes.measurementUnit}
                                onChange={e => handleFieldChange(p, 'measurementUnit', e.target.value)}
                                className="w-12 px-1.5 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                              />
                            </div>
                          </td>
                        </>
                      )}

                      {/* Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onInspect(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                            title="Side-by-side Inspection & Edit"
                          >
                            <Maximize2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onReanalyze(p)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors"
                            title="Re-run AI Analysis"
                          >
                            <Sparkles className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
