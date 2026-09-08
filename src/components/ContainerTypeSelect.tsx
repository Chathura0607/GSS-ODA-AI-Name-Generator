import React, { useState, useRef, useEffect } from 'react';
import { CONTAINER_TYPES } from '../constants/containerTypes';
import { ChevronDown, Check, AlertCircle } from 'lucide-react';

interface ContainerTypeSelectProps {
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export const ContainerTypeSelect: React.FC<ContainerTypeSelectProps> = ({
  value,
  onChange,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isValid = CONTAINER_TYPES.includes(value as any) || value === 'None' || !value;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = CONTAINER_TYPES.filter(type =>
    type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`relative inline-block ${className}`} ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border transition-all text-left w-full min-w-[130px] ${
          !isValid
            ? 'border-rose-500/80 bg-rose-500/10 text-rose-300'
            : value
            ? 'border-cyan-500/40 bg-slate-800/90 text-slate-200 hover:border-cyan-400'
            : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600'
        }`}
      >
        <span className="truncate font-medium">
          {value || 'Select Container'}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {!isValid && (
            <span title="Invalid GSS container type">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            </span>
          )}
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 mt-1 w-64 max-h-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-md">
          <div className="p-2 border-b border-slate-700/80 bg-slate-800/90">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search 49 GSS containers..."
              autoFocus
              className="w-full px-2.5 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div className="overflow-y-auto max-h-48 py-1 divide-y divide-slate-700/30">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 italic">
                No matching container types
              </div>
            ) : (
              filtered.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onChange(type);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors ${
                    value === type ? 'bg-cyan-500/20 text-cyan-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <span>{type}</span>
                  {value === type && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
