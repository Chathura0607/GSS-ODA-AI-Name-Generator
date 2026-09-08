import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { ProcessedProduct, ProductAttributes } from '../types';
import { ContainerTypeSelect } from './ContainerTypeSelect';
import { MEASUREMENT_UNITS } from '../constants/containerTypes';
import { assembleStandardName, validateStandardName } from '../services/validator';

interface ProductDetailModalProps {
  product: ProcessedProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProduct: (updated: ProcessedProduct) => void;
  onReanalyze: (product: ProcessedProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onUpdateProduct,
  onReanalyze,
}) => {
  if (!isOpen || !product) return null;

  const [attributes, setAttributes] = useState<ProductAttributes>({ ...product.attributes });
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);

  const currentStandardName = assembleStandardName(attributes);
  const validation = validateStandardName(currentStandardName, attributes.containerType);

  const handleAttributeChange = (field: keyof ProductAttributes, value: string) => {
    const updated = { ...attributes, [field]: value };
    setAttributes(updated);
  };

  const handleSave = () => {
    const updatedProduct: ProcessedProduct = {
      ...product,
      attributes,
      standardName: currentStandardName,
      characterCount: currentStandardName.length,
      isLengthValid: validation.isLengthValid,
      isContainerValid: validation.isContainerValid,
      isAlphanumericValid: validation.isAlphanumericValid,
      updatedAt: Date.now(),
    };
    onUpdateProduct(updatedProduct);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentStandardName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              GSS Inspection
            </span>
            <span className="text-sm font-semibold text-white truncate max-w-md">
              {product.sourceFileName}
            </span>
            {product.archiveSource && (
              <span className="text-[11px] text-slate-400">
                (Archive: {product.archiveSource})
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Side-by-side) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left: Image Viewer (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/60 border-r border-slate-800 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Zoom Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-lg p-1 z-10 backdrop-blur-sm">
              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.25, 3))}
                className="p-1 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.5))}
                className="p-1 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 text-slate-300 hover:text-cyan-400 transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
              <img
                src={product.thumbnailUrl}
                alt={product.sourceFileName}
                style={{ transform: `scale(${zoom})`, transition: 'transform 0.15s ease-out' }}
                className="max-h-[70vh] object-contain rounded-lg shadow-2xl pointer-events-none select-none"
              />
            </div>
          </div>

          {/* Right: Attribute Editor & Rule Checker (7 cols) */}
          <div className="lg:col-span-7 flex flex-col overflow-y-auto p-6 space-y-5">
            {/* Standard Name Output Box */}
            <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                  Generated Standard Name (GSS ODA)
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                      validation.isLengthValid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {validation.length} / 150 chars
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="font-mono text-sm text-white font-medium bg-slate-900/90 p-3 rounded-lg border border-slate-700 select-all leading-relaxed">
                {currentStandardName || <span className="text-slate-500 italic">No name components entered</span>}
              </div>

              {/* Validation Warnings */}
              {validation.warnings.length > 0 && (
                <div className="space-y-1 pt-1">
                  {validation.warnings.map((w, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Editable Fields Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                GSS Formula Components
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Brand */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Brand Name</label>
                  <input
                    type="text"
                    value={attributes.brand}
                    onChange={e => handleAttributeChange('brand', e.target.value)}
                    placeholder="e.g. Dove, Cascade, Fanta"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Sub-Brand */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Sub-Brand</label>
                  <input
                    type="text"
                    value={attributes.subBrand}
                    onChange={e => handleAttributeChange('subBrand', e.target.value)}
                    placeholder="e.g. Ceda, Genuine"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Item / Product Type */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Item (Product Type)</label>
                  <input
                    type="text"
                    value={attributes.item}
                    onChange={e => handleAttributeChange('item', e.target.value)}
                    placeholder="e.g. Hand Wash, Soda, Ginger Ale"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Flavor / Variant */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Flavor / Variant / Scent</label>
                  <input
                    type="text"
                    value={attributes.flavorOrVariant}
                    onChange={e => handleAttributeChange('flavorOrVariant', e.target.value)}
                    placeholder="e.g. Cucumber and Green Tea, Orange"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Additional Wordings */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Additional Wordings</label>
                  <input
                    type="text"
                    value={attributes.additionalWordings}
                    onChange={e => handleAttributeChange('additionalWordings', e.target.value)}
                    placeholder="e.g. Refill, No Sugar"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Container Type (Strict Dropdown) */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">
                    Container Type (Official 49)
                  </label>
                  <ContainerTypeSelect
                    value={attributes.containerType}
                    onChange={val => handleAttributeChange('containerType', val)}
                    className="w-full"
                  />
                </div>

                {/* Sub Packages / Pack Count */}
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Sub Packages</label>
                  <input
                    type="text"
                    value={attributes.subPackages}
                    onChange={e => handleAttributeChange('subPackages', e.target.value)}
                    placeholder="e.g. 12 Pack, 4 Pack, 8 Mini Cans"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {/* Size & Measurement Unit */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Size</label>
                    <input
                      type="text"
                      value={attributes.size}
                      onChange={e => handleAttributeChange('size', e.target.value)}
                      placeholder="e.g. 750, 300, 200"
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Unit</label>
                    <select
                      value={attributes.measurementUnit}
                      onChange={e => handleAttributeChange('measurementUnit', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="">None</option>
                      {MEASUREMENT_UNITS.map(u => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Value Pack Description */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1 font-medium">Value Pack Description</label>
                  <input
                    type="text"
                    value={attributes.valuePacksDescription}
                    onChange={e => handleAttributeChange('valuePacksDescription', e.target.value)}
                    placeholder="e.g. 3x eco-refill, Special Edition"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* AI Reasoning / Notes */}
            {product.notes && (
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
                <span className="font-semibold text-slate-400 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  AI Vision Reasoning
                </span>
                <p className="text-slate-300 italic">{product.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReanalyze(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Re-analyze with Vision AI
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
