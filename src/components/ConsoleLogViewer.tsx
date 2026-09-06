import React, { useRef, useEffect } from 'react';
import { Terminal, Trash2, Copy, Check } from 'lucide-react';
import { LogEntry } from '../types';

interface ConsoleLogViewerProps {
  logs: LogEntry[];
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ConsoleLogViewer: React.FC<ConsoleLogViewerProps> = ({
  logs,
  onClear,
  isOpen,
  onClose,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = logs.map((l) => `[${l.time}] [${l.level.toUpperCase()}] ${l.text}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-amber-400';
      case 'success':
        return 'text-emerald-400';
      default:
        return 'text-neutral-300';
    }
  };

  return (
    <div className="w-full max-w-[540px] mx-auto mt-4 bg-[#181818] border border-neutral-800 rounded-xl overflow-hidden shadow-xl text-neutral-200 font-mono text-xs">
      {/* Header */}
      <div className="px-3.5 py-2 bg-[#1f1f1f] border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[11px] font-semibold text-neutral-300">CMWTAT Diagnostic Console</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleCopy}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Copy Logs"
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          </button>
          <button
            onClick={onClear}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Clear Logs"
          >
            <Trash2 className="w-3 h-3" />
          </button>
          <button
            onClick={onClose}
            className="text-[11px] text-neutral-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-neutral-800 transition-colors"
          >
            Hide
          </button>
        </div>
      </div>

      {/* Logs Window */}
      <div className="p-3 h-48 overflow-y-auto space-y-1 select-text scrollbar-thin scrollbar-thumb-neutral-700">
        {logs.length === 0 ? (
          <div className="text-neutral-500 italic text-[11px]">No diagnostic logs recorded yet.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="leading-relaxed flex items-start space-x-2">
              <span className="text-neutral-500 shrink-0 text-[10px]">{log.time}</span>
              <span className={`break-all ${getLevelColor(log.level)}`}>{log.text}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
