import React, { useState } from 'react';
import {
  X,
  Target,
  Plus,
  Trash2,
  Edit2,
  Check,
  CheckCircle2,
  RotateCcw,
  Download,
  Upload,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { ProjectScope, ProjectScopeRule, KRAFT_HEINZ_GERMANY_SCOPE } from '../constants/projectScopes';
import { saveProjectScope, deleteProjectScope, resetDefaultProjectScopes } from '../services/db';

interface ProjectScopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  scopes: ProjectScope[];
  activeScopeId: string;
  onSelectActiveScope: (scopeId: string) => void;
  onScopesUpdated: () => void;
}

export const ProjectScopeModal: React.FC<ProjectScopeModalProps> = ({
  isOpen,
  onClose,
  scopes,
  activeScopeId,
  onSelectActiveScope,
  onScopesUpdated,
}) => {
  const [selectedScopeId, setSelectedScopeId] = useState<string>(activeScopeId || 'kraft-heinz-germany');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // New Scope State
  const [newScopeName, setNewScopeName] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // New Rule Form State
  const [newRuleScopeCategory, setNewRuleScopeCategory] = useState('');
  const [newRuleTraxCategory, setNewRuleTraxCategory] = useState('');
  const [newRuleClientCategory, setNewRuleClientCategory] = useState('');
  const [newRuleSmartL1Text, setNewRuleSmartL1Text] = useState('');

  const currentScope = scopes.find(s => s.id === selectedScopeId) || scopes[0] || KRAFT_HEINZ_GERMANY_SCOPE;

  if (!isOpen) return null;

  const handleSetActive = (scopeId: string) => {
    onSelectActiveScope(scopeId);
  };

  const handleCreateScope = async () => {
    if (!newScopeName.trim()) {
      alert('Please enter a scope name.');
      return;
    }

    const id = newScopeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `scope-${Date.now()}`;
    const newScope: ProjectScope = {
      id,
      name: newScopeName.trim(),
      clientName: newClientName.trim() || 'Custom Client',
      country: newCountry.trim() || 'Global',
      description: newDescription.trim() || 'Custom Project Scope',
      rules: [],
    };

    await saveProjectScope(newScope);
    onScopesUpdated();
    setSelectedScopeId(newScope.id);
    setIsCreatingNew(false);
    setNewScopeName('');
    setNewClientName('');
    setNewCountry('');
    setNewDescription('');
  };

  const handleAddRule = async () => {
    if (!newRuleTraxCategory.trim() || !newRuleClientCategory.trim()) {
      alert('Trax Category and Client Category are required.');
      return;
    }

    const smartL1List = newRuleSmartL1Text
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const newRule: ProjectScopeRule = {
      id: `rule-${Date.now()}`,
      scopeCategory: newRuleScopeCategory.trim() || newRuleClientCategory.trim(),
      traxCategory: newRuleTraxCategory.trim(),
      clientCategory: newRuleClientCategory.trim(),
      smartL1List: smartL1List.length > 0 ? smartL1List : [newRuleClientCategory.trim()],
    };

    const updatedScope: ProjectScope = {
      ...currentScope,
      rules: [...currentScope.rules, newRule],
    };

    await saveProjectScope(updatedScope);
    onScopesUpdated();

    // Reset inputs
    setNewRuleScopeCategory('');
    setNewRuleTraxCategory('');
    setNewRuleClientCategory('');
    setNewRuleSmartL1Text('');
  };

  const handleDeleteRule = async (ruleId: string) => {
    const updatedScope: ProjectScope = {
      ...currentScope,
      rules: currentScope.rules.filter(r => r.id !== ruleId),
    };
    await saveProjectScope(updatedScope);
    onScopesUpdated();
  };

  const handleDeleteScope = async (scopeId: string) => {
    if (scopeId === 'kraft-heinz-germany') {
      alert('The default Kraft Heinz Germany scope cannot be deleted, but you can edit its rules or add your own scopes.');
      return;
    }
    if (confirm(`Delete project scope "${currentScope.name}"?`)) {
      await deleteProjectScope(scopeId);
      onScopesUpdated();
      setSelectedScopeId('kraft-heinz-germany');
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Reset all project scopes to original default templates? Custom scopes will be restored to defaults.')) {
      await resetDefaultProjectScopes();
      onScopesUpdated();
      setSelectedScopeId('kraft-heinz-germany');
    }
  };

  const handleExportScopes = () => {
    const blob = new Blob([JSON.stringify(scopes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSS_ODA_Project_Scopes_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportScopes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          for (const s of parsed) {
            if (s.id && s.name && Array.isArray(s.rules)) {
              await saveProjectScope(s);
            }
          }
          onScopesUpdated();
          alert('Project Scopes imported successfully!');
        } else {
          alert('Invalid JSON format for project scopes.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Project Scope & Scope Matrix Hub</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Kraft Heinz Germany & Custom
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Auto-select Trax Category (Col 2), Client Category (Col 3), and Smart L1 (Col 4) for each uploaded image based on project scope.
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

        {/* Modal Main Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left Sidebar: Scope Selector (4 cols) */}
          <div className="md:col-span-4 bg-slate-950/60 border-r border-slate-800 p-4 flex flex-col space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Available Scopes ({scopes.length})
              </span>
              <button
                type="button"
                onClick={() => setIsCreatingNew(!isCreatingNew)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isCreatingNew ? 'Cancel' : 'New Scope'}</span>
              </button>
            </div>

            {/* Create New Scope Box */}
            {isCreatingNew && (
              <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/40 space-y-2.5 shadow-lg animate-in fade-in">
                <h4 className="text-xs font-bold text-cyan-300">Create New Project Scope</h4>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Project Scope Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Kraft Heinz UK Scope"
                    value={newScopeName}
                    onChange={e => setNewScopeName(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Client Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Kraft Heinz"
                      value={newClientName}
                      onChange={e => setNewClientName(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Country / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Germany, UK"
                      value={newCountry}
                      onChange={e => setNewCountry(e.target.value)}
                      className="w-full px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Description</label>
                  <input
                    type="text"
                    placeholder="Brief description..."
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCreateScope}
                  className="w-full py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-md transition-all"
                >
                  Create & Configure Rules
                </button>
              </div>
            )}

            {/* Scope Cards List */}
            <div className="space-y-2 flex-1">
              {scopes.map(s => {
                const isActive = activeScopeId === s.id;
                const isSelected = selectedScopeId === s.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedScopeId(s.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-white">{s.name}</span>
                          {s.id === 'kraft-heinz-germany' && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              TEMPLATE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {s.clientName} • {s.country} ({s.rules.length} rule categories)
                        </p>
                      </div>

                      {isActive ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          ACTIVE
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation();
                            handleSetActive(s.id);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors shrink-0"
                        >
                          Set Active
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions (Backup / Reset) */}
            <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportScopes}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
                  title="Export Scopes as JSON"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>
                <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>Import JSON</span>
                  <input type="file" accept=".json" onChange={handleImportScopes} className="hidden" />
                </label>
              </div>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="w-full flex items-center justify-center gap-1.5 py-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-900 transition-colors text-[10px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          </div>

          {/* Right Area: Scope Rules & Matrix Table (8 cols) */}
          <div className="md:col-span-8 p-6 flex flex-col space-y-5 overflow-y-auto">
            {/* Top Banner for selected scope */}
            <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/80">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{currentScope.name}</h3>
                  {activeScopeId === currentScope.id && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active AI Standardizer Scope
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {currentScope.description || `Classification matrix for ${currentScope.clientName} (${currentScope.country})`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {activeScopeId !== currentScope.id && (
                  <button
                    type="button"
                    onClick={() => handleSetActive(currentScope.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Use This Project Scope
                  </button>
                )}

                {currentScope.id !== 'kraft-heinz-germany' && (
                  <button
                    type="button"
                    onClick={() => handleDeleteScope(currentScope.id)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors"
                    title="Delete custom scope"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Scope Matrix Table Header Info */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Project Scope Matrix Columns (Image Template Mapping)
              </span>
              <span>{currentScope.rules.length} rule entries</span>
            </div>

            {/* The 4-Column Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700/80">
                  <tr>
                    <th className="p-3 w-1/4">1st Col: Scope Group</th>
                    <th className="p-3 w-1/5 text-cyan-300">2nd Col: Trax Category</th>
                    <th className="p-3 w-1/5 text-purple-300">3rd Col: Client Category</th>
                    <th className="p-3 w-1/3 text-emerald-300">Last Col: Smart L1 Options</th>
                    <th className="p-3 w-10 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {currentScope.rules.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No rules added to this scope yet. Use the form below to add categories.
                      </td>
                    </tr>
                  ) : (
                    currentScope.rules.map(r => (
                      <tr key={r.id} className="hover:bg-slate-800/40 transition-colors align-top">
                        <td className="p-3 font-medium text-slate-200">
                          {r.scopeCategory}
                          {r.notes && (
                            <p className="text-[10px] text-slate-400 font-normal italic mt-0.5">{r.notes}</p>
                          )}
                        </td>
                        <td className="p-3 font-semibold text-cyan-400 bg-cyan-500/5">
                          {r.traxCategory}
                        </td>
                        <td className="p-3 font-semibold text-purple-300 bg-purple-500/5">
                          {r.clientCategory}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto pr-1">
                            {r.smartL1List.map((smart, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 border border-slate-700 leading-tight"
                              >
                                {smart}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteRule(r.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Remove this category row"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add New Rule Form */}
            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                Add Category Rule Row to "{currentScope.name}"
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                    1st Col: Scope Group
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Feinkost & Ketchup"
                    value={newRuleScopeCategory}
                    onChange={e => setNewRuleScopeCategory(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-cyan-400 mb-1 font-semibold">
                    2nd Col: Trax Category *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sauces & Condiment"
                    value={newRuleTraxCategory}
                    onChange={e => setNewRuleTraxCategory(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-cyan-500/40 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-purple-400 mb-1 font-semibold">
                    3rd Col: Client Category *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sauces & Ketchup"
                    value={newRuleClientCategory}
                    onChange={e => setNewRuleClientCategory(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-purple-500/40 rounded-lg text-slate-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-emerald-400 mb-1 font-semibold">
                  Last Col: Smart L1 List (One item per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ketchup&#10;BBQ Sauce&#10;Curry Sauce&#10;Chili Sauce&#10;Senf Sauce (Mustard Sauce)"
                  value={newRuleSmartL1Text}
                  onChange={e => setNewRuleSmartL1Text(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-emerald-500/40 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Rule to Matrix
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Active scope automatically applies to all vision uploads and batch processing</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
          >
            Close Scope Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
