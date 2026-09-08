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
} from 'lucide-react';
import { ProcessedProduct, ProductAttributes } from '../types';
import { ContainerTypeSelect } from './ContainerTypeSelect';
import { assembleStandardName, validateStandardName } from '../services/validator';
import { exportToExcel } from '../services/excelExport';

interface ProductTableProps {
  products: ProcessedProduct[];
  onUpdateProduct: (product: ProcessedProduct) => void;
  onDeleteProduct: (id: string) => void;
  onDeleteMultiple: (ids: string[]) => void;
  onReanalyze: (product: ProcessedProduct) => void;
  onInspect: (product: ProcessedProduct) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onUpdateProduct,
  onDeleteProduct,
  onDeleteMultiple,
  onReanalyze,
  onInspect,
}) => {
  const [search, setSearch] = useState('');
  const [filterValid, setFilterValid] = useState<'all' | 'valid' | 'warning'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bulkCopied, setBulkCopied] = useState(false);

  // Filter products
  const filteredProducts = products.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch =
      p.standardName.toLowerCase().includes(term) ||
      p.attributes.brand.toLowerCase().includes(term) ||
      p.attributes.item.toLowerCase().includes(term) ||
      p.attributes.flavorOrVariant.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (filterValid === 'valid') return p.isLengthValid && p.isContainerValid && p.isAlphanumericValid;
    if (filterValid === 'warning') return !p.isLengthValid || !p.isContainerValid || !p.isAlphanumericValid;
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

    const updated: ProcessedProduct = {
      ...product,
      attributes: updatedAttributes,
      standardName,
      characterCount: standardName.length,
      isLengthValid: validation.isLengthValid,
      isContainerValid: validation.isContainerValid,
      isAlphanumericValid: validation.isAlphanumericValid,
      updatedAt: Date.now(),
    };

    onUpdateProduct(updated);
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800/40 border border-slate-700/80 rounded-2xl">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, brand, item, flavor..."
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
              <option value="valid">100% Valid Only</option>
              <option value="warning">Has Rule Warnings</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <>
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
              Export Excel
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
                <th className="p-3 min-w-[120px]">Brand</th>
                <th className="p-3 min-w-[120px]">Item (Type)</th>
                <th className="p-3 min-w-[130px]">Flavor / Scent</th>
                <th className="p-3 min-w-[150px]">Container (Official 49)</th>
                <th className="p-3 min-w-[90px]">Pack</th>
                <th className="p-3 min-w-[100px]">Size & Unit</th>
                <th className="p-3 w-28 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500">
                    No products matching current filter. Upload product images or clear search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => {
                  const isSelected = selectedIds.includes(p.id);
                  const isNameOverLimit = p.characterCount > 150;

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

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${
                                isNameOverLimit
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {p.characterCount} / 150
                            </span>

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

                            {p.isContainerValid && (
                              <span className="text-[10px] text-cyan-400 font-medium">
                                Valid Container
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Brand */}
                      <td className="p-3">
                        <input
                          type="text"
                          value={p.attributes.brand}
                          onChange={e => handleFieldChange(p, 'brand', e.target.value)}
                          className="w-full px-2 py-1 bg-slate-800/80 border border-slate-700 rounded text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                        />
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
