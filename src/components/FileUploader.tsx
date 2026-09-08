import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Sparkles,
  FolderArchive,
  AlertCircle,
} from 'lucide-react';
import { processUploadedFile, ExtractedImageFile } from '../services/archiveExtractor';

interface FileUploaderProps {
  onFilesExtracted: (files: ExtractedImageFile[]) => void;
  isProcessing: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesExtracted,
  isProcessing,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Paste from clipboard support
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) imageFiles.push(file);
        }
      }

      if (imageFiles.length > 0) {
        handleFiles(imageFiles);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFiles = async (files: File[] | FileList) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setErrorText(null);
    setStatusText(`Processing ${fileList.length} file(s)...`);

    const allExtracted: ExtractedImageFile[] = [];

    for (const file of fileList) {
      try {
        const extracted = await processUploadedFile(file, msg => setStatusText(msg));
        allExtracted.push(...extracted);
      } catch (err: any) {
        console.error('Extraction error:', err);
        setErrorText(err?.message || `Failed to process ${file.name}`);
      }
    }

    setStatusText(null);
    if (allExtracted.length > 0) {
      onFilesExtracted(allExtracted);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Quick Demo Samples
  const handleLoadSample = async (samplePath: string, sampleName: string) => {
    try {
      setStatusText(`Loading demo sample ${sampleName}...`);
      const response = await fetch(samplePath);
      const blob = await response.blob();
      const file = new File([blob], sampleName, { type: blob.type || 'image/jpeg' });
      await handleFiles([file]);
    } catch (err) {
      setErrorText('Failed to load sample image.');
    }
  };

  const handleLoadAllSamples = async () => {
    try {
      setStatusText('Loading all test FMCG samples...');
      const samples = [
        { path: './samples/tru_blu_ceda_12pack.jpg', name: 'Tru_Blu_Ceda_12Pack.jpg' },
        { path: './samples/cascade_ginger_ale_4pack.jpg', name: 'Cascade_Ginger_Ale_4Pack.jpg' },
        { path: './samples/fanta_orange_8pack.jpg', name: 'Fanta_Orange_NoSugar_8Pack.jpg' },
      ];

      const files: File[] = [];
      for (const s of samples) {
        const res = await fetch(s.path);
        const blob = await res.blob();
        files.push(new File([blob], s.name, { type: 'image/jpeg' }));
      }
      await handleFiles(files);
    } catch (err) {
      setErrorText('Failed to load demo samples.');
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer text-center group ${
          isDragging
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.005]'
            : 'border-slate-700/80 bg-slate-800/40 hover:border-cyan-500/50 hover:bg-slate-800/70'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={e => e.target.files && handleFiles(e.target.files)}
          multiple
          accept="image/*,.pdf,.zip,.rar,application/pdf,application/zip,application/x-rar-compressed"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
              isDragging
                ? 'bg-cyan-500 text-white shadow-xl shadow-cyan-500/40'
                : 'bg-slate-800 text-cyan-400 border border-slate-700 group-hover:border-cyan-500/40 group-hover:scale-110'
            }`}
          >
            <UploadCloud className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-tight">
              Drag & Drop Product Images or Archives Here
            </h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Upload single or batch images. Automatically extracts pages from <strong className="text-slate-300">PDF</strong> files and images from <strong className="text-slate-300">ZIP</strong> archives.
            </p>
          </div>

          {/* Supported badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <ImageIcon className="w-3 h-3 text-cyan-400" />
              JPG, PNG, WEBP
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <FileText className="w-3 h-3 text-rose-400" />
              PDF (Pages Extracted)
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <FolderArchive className="w-3 h-3 text-amber-400" />
              ZIP Archives
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Ctrl+V Paste Image
            </span>
          </div>
        </div>

        {statusText && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            {statusText}
          </div>
        )}
      </div>

      {errorText && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorText}</span>
        </div>
      )}

      {/* Quick Test Samples Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Quick test with GSS sample images:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleLoadSample('./samples/tru_blu_ceda_12pack.jpg', 'Tru_Blu_Ceda_12Pack.jpg');
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Tru Blu Ceda (12 Pack)
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleLoadSample('./samples/cascade_ginger_ale_4pack.jpg', 'Cascade_Ginger_Ale_4Pack.jpg');
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Cascade Ginger Ale (4 Pack)
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleLoadSample('./samples/fanta_orange_8pack.jpg', 'Fanta_Orange_NoSugar_8Pack.jpg');
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Fanta Orange (8 Pack)
          </button>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              handleLoadAllSamples();
            }}
            className="text-[11px] font-semibold px-3 py-1 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 transition-colors"
          >
            Load All 3 Samples
          </button>
        </div>
      </div>
    </div>
  );
};
