import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, ExternalLink } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({
  isOpen,
  onClose,
  onDownload,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  if (!isOpen) return null;

  const handleDownloadZip = async () => {
    try {
      setDownloadingZip(true);
      const res = await fetch('/api/download-zip');
      if (!res.ok) throw new Error('Failed to generate ZIP');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tenzo-bakers-bms.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (err) {
      console.error('ZIP download error:', err);
      // Fallback: direct navigation
      window.location.href = '/api/download-zip';
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleCopy = async () => {
    try {
      const resp = await fetch('/tenzo-bakers-standalone.html');
      const htmlText = await resp.text();
      await navigator.clipboard.writeText(htmlText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-[#451a03] to-[#78350f] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileCode className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="text-base font-bold">Standalone Single-File Web App</h3>
              <p className="text-xs text-amber-200/80">Self-contained HTML, CSS, and JS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-stone-600 mb-4 leading-relaxed">
            As requested, <strong>Tenzo Cafe and Bakers</strong> has also been compiled into a complete, standalone, single-file HTML document with embedded CSS inside <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">&lt;style&gt;</code> and JavaScript inside <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">&lt;script&gt;</code>.
          </p>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-5 text-xs text-stone-700 space-y-1.5">
            <div className="font-bold text-amber-900 text-sm mb-1">
              ✨ Highlights of Standalone Executable:
            </div>
            <div>• Zero external server or runtime dependencies.</div>
            <div>• Works 100% offline on any smartphone, iPad, tablet, or kitchen computer.</div>
            <div>• Real-time batch scaling, regex text parser, and profit calculator included.</div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .HTML File</span>
            </button>

            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-xl border border-stone-300 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied HTML Code!' : 'Copy Raw Code'}</span>
            </button>

            <a
              href="/tenzo-bakers-standalone.html"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold rounded-xl border border-stone-300 transition-all cursor-pointer"
              title="Open standalone page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* GitHub Source Code ZIP Export */}
          <div className="mt-5 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between p-3.5 bg-stone-900 text-white rounded-xl">
              <div>
                <div className="font-bold text-xs flex items-center gap-1.5 text-stone-100">
                  <span>📦 Full Source Code for GitHub</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">.ZIP</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Download all React/Vite source files to upload directly to your personal GitHub repo.
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={downloadingZip}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-95 disabled:opacity-60 text-stone-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer whitespace-nowrap"
              >
                {downloadingZip ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating ZIP...</span>
                  </>
                ) : zipSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-stone-950" />
                    <span>ZIP Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-stone-950" />
                    <span>Download ZIP</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
