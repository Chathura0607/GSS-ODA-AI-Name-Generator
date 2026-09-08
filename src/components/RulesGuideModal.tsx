import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Info, Layers, Tag, ShieldCheck } from 'lucide-react';
import { CONTAINER_TYPES } from '../constants/containerTypes';

interface RulesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'formula' | 'containers' | 'rules'>('formula');
  const [containerSearch, setContainerSearch] = useState('');

  if (!isOpen) return null;

  const filteredContainers = CONTAINER_TYPES.filter(c =>
    c.toLowerCase().includes(containerSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">GSS ODA Naming Convention & Specification</h2>
              <p className="text-xs text-slate-400">Operational Data Analyst standards and cataloguing guidelines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/80">
          <button
            onClick={() => setActiveTab('formula')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'formula'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            Naming Formula & Syntax
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'rules'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            6 Core Business Rules
          </button>
          <button
            onClick={() => setActiveTab('containers')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'containers'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Official Container Types ({CONTAINER_TYPES.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-slate-300 text-sm">
          {activeTab === 'formula' && (
            <div className="space-y-6">
              {/* Formula Blueprint */}
              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider">Standard Order of Elements</span>
                <div className="mt-2 text-base font-mono font-semibold text-white flex flex-wrap items-center gap-1.5 leading-relaxed">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">[Brand]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">[Sub-Brand]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">[Item / Product Type]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">[Flavor / Attributes]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">[Additional Wordings]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">[Container Type]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">[Sub Packages]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">[Size + Unit]</span>
                  <span className="text-slate-500">+</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">[Value Pack]</span>
                </div>
              </div>

              {/* Concrete Examples from Guidelines */}
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Canonical Examples from GSS Guidelines
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Dove Example */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400">Personal Care Example</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Verified</span>
                    </div>
                    <p className="font-mono text-xs text-white font-semibold bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                      Dove Hand Wash Cucumber and Green Tea Scent Refill Pouch 750 ml
                    </p>
                    <ul className="text-xs space-y-1 text-slate-400 list-disc pl-4">
                      <li><strong>Brand:</strong> Dove</li>
                      <li><strong>Item / Product Type:</strong> Hand Wash</li>
                      <li><strong>Flavor:</strong> Cucumber and Green Tea Scent</li>
                      <li><strong>Additional Wordings:</strong> Refill</li>
                      <li><strong>Container Type:</strong> Pouch (from GSS 49 list)</li>
                      <li><strong>Size & Unit:</strong> 750 ml</li>
                    </ul>
                  </div>

                  {/* Beverage Pack Example */}
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-400">Multi-Pack Beverage Example</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Verified</span>
                    </div>
                    <p className="font-mono text-xs text-white font-semibold bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
                      Tru Blu Ceda Creaming Soda Pack Plastic 12 Pack 300 ml
                    </p>
                    <ul className="text-xs space-y-1 text-slate-400 list-disc pl-4">
                      <li><strong>Brand:</strong> Tru Blu</li>
                      <li><strong>Sub-Brand:</strong> Ceda</li>
                      <li><strong>Item / Flavor:</strong> Creaming Soda</li>
                      <li><strong>Container Type:</strong> Pack Plastic</li>
                      <li><strong>Sub Packages:</strong> 12 Pack</li>
                      <li><strong>Size & Unit:</strong> 300 ml</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                <Info className="w-4 h-4 shrink-0" />
                These 6 rules are strictly checked in real-time by the GSS ODA validation engine.
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">1</div>
                  <div>
                    <h5 className="font-semibold text-white text-xs">Sub-Brand Duplication Rule</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      If the Sub-Brand contains the Brand Name, the Brand isn't mandatory in the Name to prevent repetitive redundancy.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">2</div>
                  <div>
                    <h5 className="font-semibold text-white text-xs">Item Identification</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Item indicates the type of product (e.g. toothbrush, soap bar, wine, soda, ginger ale). It should be indicated by the sub-category if possible.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">3</div>
                  <div>
                    <h5 className="font-semibold text-white text-xs">Value Packs / Attributes</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Value packs is a specific attribute per product, e.g. "Special edition", "Christmas edition", "3x eco-refill", "No Sugar".
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">4</div>
                  <div>
                    <h5 className="font-semibold text-white text-xs">Alphanumeric Characters Only</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Names must be composed of numbers and letters (Alphanumeric Values) and single spaces only. Special symbols like #, $, %, @, & are prohibited.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">5</div>
                  <div>
                    <h5 className="font-semibold text-white text-xs">Maximum 150 Characters Limit</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      The amount of characters in the standard name cannot exceed 150. A live character counter dynamically signals warning when approaching or exceeding this limit.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">6</div>
                  <div>
                    <h5 className="font-semibold text-white text-xs">Consistent Measurement Units</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Measurement units should be standard lowercase and consistent across all records (e.g. ml, l, kg, g, oz, cl).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'containers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Container Type MUST only be selected from this official list of 49 containers:
                </p>
                <input
                  type="text"
                  placeholder="Filter containers..."
                  value={containerSearch}
                  onChange={e => setContainerSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-96 overflow-y-auto pr-1">
                {filteredContainers.map(container => (
                  <div
                    key={container}
                    className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs font-medium text-slate-300 flex items-center gap-2 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    <span className="truncate">{container}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between text-xs text-slate-400">
          <span>GSS Operational Data Analyst Guidelines</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
