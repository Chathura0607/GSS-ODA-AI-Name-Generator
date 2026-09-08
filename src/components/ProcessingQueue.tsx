import React from 'react';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { ProcessedProduct } from '../types';

interface ProcessingQueueProps {
  queue: ProcessedProduct[];
  isProcessing: boolean;
  onRetry: (product: ProcessedProduct) => void;
  onCancelAll?: () => void;
}

export const ProcessingQueue: React.FC<ProcessingQueueProps> = ({
  queue,
  isProcessing,
  onRetry,
  onCancelAll,
}) => {
  if (queue.length === 0) return null;

  const total = queue.length;
  const completed = queue.filter(q => q.status === 'completed').length;
  const errors = queue.filter(q => q.status === 'error').length;
  const percent = Math.round(((completed + errors) / total) * 100) || 0;

  return (
    <div className="p-4 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 text-emerald-400" />
          )}
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {isProcessing ? 'Processing Batch Queue...' : 'Batch Processing Summary'}
          </span>
          <span className="text-xs font-mono text-slate-400">
            ({completed}/{total} completed, {errors} errors)
          </span>
        </div>

        {isProcessing && onCancelAll && (
          <button
            onClick={onCancelAll}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium transition-colors"
          >
            Cancel Remaining
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/60">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Queue Items Row */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 max-h-24">
        {queue.map(item => {
          let statusBadge = (
            <span className="flex items-center gap-1 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" /> Queued
            </span>
          );

          if (item.status === 'analyzing') {
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] text-cyan-400 animate-pulse font-medium">
                <Loader2 className="w-3 h-3 animate-spin" /> AI Analyzing...
              </span>
            );
          } else if (item.status === 'extracting') {
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] text-amber-400 font-medium">
                <RefreshCw className="w-3 h-3 animate-spin" /> Extracting...
              </span>
            );
          } else if (item.status === 'completed') {
            statusBadge = (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Done
              </span>
            );
          } else if (item.status === 'error') {
            statusBadge = (
              <button
                onClick={() => onRetry(item)}
                className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 font-medium underline"
                title="Click to retry analysis"
              >
                <AlertCircle className="w-3 h-3" /> Retry
              </button>
            );
          }

          return (
            <div
              key={item.id}
              className={`flex items-center gap-2 p-2 rounded-xl border shrink-0 text-xs transition-all ${
                item.status === 'analyzing'
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-200 shadow-md shadow-cyan-500/10'
                  : item.status === 'completed'
                  ? 'bg-slate-900/60 border-slate-700/60 text-slate-300'
                  : item.status === 'error'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400'
              }`}
            >
              {item.thumbnailUrl && (
                <img
                  src={item.thumbnailUrl}
                  alt="thumbnail"
                  className="w-7 h-7 rounded object-contain bg-slate-950 border border-slate-700"
                />
              )}
              <div className="max-w-[130px]">
                <p className="truncate font-semibold text-[11px] text-white">
                  {item.sourceFileName}
                </p>
                {statusBadge}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
