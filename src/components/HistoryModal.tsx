import React, { useState, useEffect } from 'react';
import {
  X,
  History,
  Download,
  Upload,
  Trash2,
  Calendar,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';
import { ProcessedProduct, AppSettings } from '../types';
import {
  getAllProducts,
  deleteProduct,
  clearAllProducts,
  exportBackupJSON,
  importBackupJSON,
  purgeOldRecords,
} from '../services/db';
import { exportToExcel } from '../services/excelExport';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onRestoreOrRefresh: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  settings,
  onRestoreOrRefresh,
}) => {
  const [historyItems, setHistoryItems] = useState<ProcessedProduct[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      // Purge any records older than retentionDays first
      await purgeOldRecords(settings.retentionDays || 7);
      const items = await getAllProducts();
      setHistoryItems(items);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredItems = historyItems.filter(item => {
    const term = search.toLowerCase();
    return (
      item.standardName.toLowerCase().includes(term) ||
      item.attributes.brand.toLowerCase().includes(term) ||
      item.sourceFileName.toLowerCase().includes(term)
    );
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this historical record?')) return;
    await deleteProduct(id);
    await loadHistory();
    onRestoreOrRefresh();
  };

  const handleClearAll = async () => {
    if (!confirm('Warning: This will clear all historical generated product records. Continue?')) return;
    await clearAllProducts();
    await loadHistory();
    onRestoreOrRefresh();
    setStatusMessage('All history cleared.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleDownloadBackup = async () => {
    try {
      const json = await exportBackupJSON();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GSS_ODA_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setStatusMessage('Backup JSON downloaded successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      alert('Failed to generate backup JSON.');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async event => {
      try {
        const content = event.target?.result as string;
        const count = await importBackupJSON(content);
        await loadHistory();
        onRestoreOrRefresh();
        setStatusMessage(`Successfully restored ${count} products from backup!`);
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err: any) {
        alert(err?.message || 'Failed to import backup JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Audit & 7-Day History Vault</h2>
              <p className="text-xs text-slate-400">
                Automatic {settings.retentionDays}-day retention policy • Local IndexedDB storage with backup & restore
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

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search history by name, brand, or file..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Download full database backup in JSON format"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Backup JSON
            </button>

            <label className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              Restore Backup
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>

            <button
              onClick={() => exportToExcel(filteredItems, 'GSS_ODA_History')}
              disabled={filteredItems.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors disabled:opacity-50"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Export Excel
            </button>

            <button
              onClick={handleClearAll}
              disabled={historyItems.length === 0}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors disabled:opacity-50"
              title="Clear all historical records"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div className="px-6 py-2 bg-cyan-500/10 border-b border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            {statusMessage}
          </div>
        )}

        {/* History Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 text-xs gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
              Loading history records...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs gap-2">
              <History className="w-8 h-8 stroke-1 text-slate-600" />
              <p>No historical records found for the past {settings.retentionDays} days.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredItems.map(item => {
                const dateStr = new Date(item.createdAt).toLocaleDateString();
                const timeStr = new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const daysOld = Math.floor((Date.now() - item.createdAt) / (1000 * 60 * 60 * 24));
                const daysLeft = Math.max(0, settings.retentionDays - daysOld);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-4 hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {item.thumbnailUrl ? (
                        <img
                          src={item.thumbnailUrl}
                          alt="preview"
                          className="w-12 h-12 rounded-lg object-contain bg-slate-900 border border-slate-700 p-0.5 shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-600 shrink-0">
                          N/A
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-xs text-white truncate max-w-md">
                            {item.standardName}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                            {item.characterCount} chars
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                          <span>Brand: <strong className="text-slate-300">{item.attributes.brand || '-'}</strong></span>
                          <span>Container: <strong className="text-slate-300">{item.attributes.containerType || '-'}</strong></span>
                          <span>Size: <strong className="text-slate-300">{item.attributes.size} {item.attributes.measurementUnit}</strong></span>
                          <span>File: <strong className="text-slate-300">{item.sourceFileName}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right text-[11px] text-slate-400">
                        <div className="flex items-center gap-1 justify-end text-slate-300">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          {dateStr} {timeStr}
                        </div>
                        <span className="text-[10px] text-purple-400 font-medium">
                          Auto-purge in {daysLeft}d
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete from history"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-800/30 flex items-center justify-between text-xs text-slate-400">
          <span>Total historical items: {historyItems.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
          >
            Close Vault
          </button>
        </div>
      </div>
    </div>
  );
};
