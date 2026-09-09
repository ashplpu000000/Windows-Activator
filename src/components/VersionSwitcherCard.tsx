import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Disc,
  Download,
  Copy,
  Check,
  Sparkles,
  Terminal,
  ChevronDown,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { SystemEditionItem } from '../types';
import { buildMigrationPlan } from '../utils/isoMatcher';

interface VersionSwitcherCardProps {
  currentHostOS: string;
  isActivated: boolean;
  editions: SystemEditionItem[];
  selectedEditionIndex: number;
  onSelectEdition: (index: number) => void;
  onConvert: () => void;
  isProcessing: boolean;
  onOpenIsoCenter: (targetOS?: string) => void;
}

export const VersionSwitcherCard: React.FC<VersionSwitcherCardProps> = ({
  currentHostOS,
  isActivated,
  editions,
  selectedEditionIndex,
  onSelectEdition,
  onConvert,
  isProcessing,
  onOpenIsoCenter,
}) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [filterSearch, setFilterSearch] = useState('');

  const targetEdition: SystemEditionItem = useMemo(() => {
    if (selectedEditionIndex >= 0 && editions[selectedEditionIndex]) {
      return editions[selectedEditionIndex];
    }
    // Default to Windows 8.1 Pro or Windows 7 Ultimate as an illustrative example if none selected
    const found = editions.find((e) => e.displayOS.includes('Windows 8.1 Pro')) || editions[0];
    return found;
  }, [selectedEditionIndex, editions]);

  // Migration plan calculation
  const plan = useMemo(() => {
    return buildMigrationPlan(currentHostOS || 'Windows 11 Home', targetEdition);
  }, [currentHostOS, targetEdition]);

  const matchingIso = plan.matchingIso;

  const handleCopy = (text: string, type: 'key' | 'url' | 'cmd') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    }
  };

  const filteredEditions = useMemo(() => {
    if (!filterSearch.trim()) return editions;
    const q = filterSearch.toLowerCase();
    return editions.filter(
      (e) =>
        e.displayOS.toLowerCase().includes(q) ||
        e.family.toLowerCase().includes(q) ||
        (e.sku && e.sku.toLowerCase().includes(q)),
    );
  }, [editions, filterSearch]);

  return (
    <div className="space-y-4">
      {/* Title & Introduction Bar */}
      <div className="p-4 bg-gradient-to-r from-blue-50/80 via-indigo-50/60 to-purple-50/60 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/30 rounded-xl border border-blue-200/80 dark:border-blue-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
              Windows Version & Edition Migration Engine
            </h3>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded">
              Any Version / Edition
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Switch your installed Windows OS to any version or edition (e.g. from{' '}
            <strong>{currentHostOS || 'Win 11 Pro'}</strong> to <strong>Win 8 Pro</strong>,{' '}
            <strong>Win 7 Ultimate</strong>, or <strong>Windows Server 2025</strong>). Download official ISO
            files for cross-version installs or perform instant in-place SKU conversions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenIsoCenter(targetEdition.displayOS)}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer shrink-0 whitespace-nowrap"
        >
          <Disc className="w-4 h-4 shrink-0" />
          <span>ISO Download Center</span>
        </button>
      </div>

      {/* Interactive Switcher Visual: Host OS ➔ Target OS */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
        {/* Left: Current Host OS */}
        <div className="md:col-span-5 p-3.5 bg-white dark:bg-[#25252b] rounded-xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Current Installed OS (Host)
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isActivated
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
              }`}
            >
              {isActivated ? 'Activated' : 'Not Activated'}
            </span>
          </div>

          <div className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2 truncate">
            <HardDrive className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="truncate">{currentHostOS || 'Windows 11 Home'}</span>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Machine local environment profile
          </p>
        </div>

        {/* Center Transition Icon */}
        <div className="md:col-span-1 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-2xs rotate-90 md:rotate-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Right: Target OS Selector */}
        <div className="md:col-span-5 p-3.5 bg-white dark:bg-[#25252b] rounded-xl border border-blue-300 dark:border-blue-700/80 shadow-2xs space-y-1.5 relative">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Target Windows Version / Edition
            </span>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {targetEdition.sku}
            </span>
          </div>

          {/* Dropdown selector button */}
          <button
            type="button"
            onClick={() => setSelectorOpen(!selectorOpen)}
            className="w-full text-left flex items-center justify-between text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer py-0.5"
          >
            <div className="flex items-center gap-2 truncate">
              <Disc className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="truncate">{targetEdition.displayOS}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0 ml-1" />
          </button>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-neutral-500 dark:text-neutral-400">Target SKU Key:</span>
            <div className="flex items-center gap-1.5">
              <code className="font-mono text-neutral-700 dark:text-neutral-300 text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded select-all">
                {targetEdition.key}
              </code>
              <button
                type="button"
                onClick={() => handleCopy(targetEdition.key, 'key')}
                className="p-1 text-neutral-400 hover:text-blue-500 cursor-pointer"
                title="Copy Target Product Key"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Click to change target to any edition (Windows 11, 10, 8.1, 7, or Server)
          </p>

          {/* Dropdown list */}
          {selectorOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#202026] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl z-40 p-2 max-h-72 flex flex-col">
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Search target Windows edition (e.g. Win 8, Win 7, Server 2025)..."
                className="w-full px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-transparent focus:border-blue-500 focus:outline-none mb-2"
                autoFocus
              />

              <div className="overflow-y-auto space-y-1 divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredEditions.map((ed) => {
                  const actualIdx = editions.indexOf(ed);
                  const isSelected = actualIdx === selectedEditionIndex;
                  return (
                    <button
                      key={ed.id}
                      type="button"
                      onClick={() => {
                        onSelectEdition(actualIdx);
                        setSelectorOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-semibold">{ed.displayOS}</span>
                        <span className="text-[10px] opacity-70 ml-2 font-mono">
                          {ed.family} · {ed.sku}
                        </span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MIGRATION ACTION & ISO REQUIREMENT CARD                                   */}
      {/* ========================================================================= */}
      {plan.needsIsoDownload ? (
        /* Cross-Version Migration (Requires ISO Download) */
        <div className="p-4.5 bg-neutral-50/90 dark:bg-[#25252b] rounded-xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-2xs space-y-3.5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 rounded-lg">
                  <Disc className="w-4 h-4" />
                </span>
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  ISO Download Required for Migration to {targetEdition.displayOS}
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Switching across major Windows generations (e.g. from{' '}
                <strong>{currentHostOS}</strong> to <strong>{targetEdition.displayOS}</strong>) requires the
                official ISO installation media to create a bootable installer or mount the setup image.
              </p>
            </div>

            <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 rounded-md shrink-0">
              Cross-Version
            </span>
          </div>

          {/* Matching ISO Card */}
          {matchingIso && (
            <div className="p-3.5 bg-white dark:bg-[#1e1e24] rounded-xl border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {matchingIso.versionName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold rounded">
                    {matchingIso.fileSize}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded">
                    {matchingIso.architecture}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {matchingIso.description}
                </p>
                {matchingIso.sha256 && (
                  <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 pt-0.5">
                    <span>SHA-256:</span>
                    <span className="truncate max-w-[220px] sm:max-w-xs">{matchingIso.sha256}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <a
                  href={matchingIso.directDownloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>Download ISO ({matchingIso.fileSize})</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleCopy(matchingIso.directDownloadUrl, 'url')}
                  className="p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs transition-colors cursor-pointer"
                  title="Copy Direct Download Link"
                >
                  {copiedUrl ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Migration Roadmap Steps */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              How to complete this version migration:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {plan.stepByStep.map((step, sIdx) => (
                <div
                  key={sIdx}
                  className="p-2.5 bg-white dark:bg-[#1e1e24] rounded-lg border border-neutral-200/70 dark:border-neutral-800 space-y-1"
                >
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                    Step {sIdx + 1}
                  </span>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {step.replace(/^\d+\.\s*/, '')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Generated Unattended Setup Command */}
          {plan.setupCommand && (
            <div className="p-2.5 bg-neutral-900 text-neutral-200 rounded-lg text-xs font-mono flex items-center justify-between gap-2 overflow-x-auto">
              <div className="flex items-center gap-2 truncate">
                <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-neutral-400 text-[11px]">Migration Command:</span>
                <code className="text-emerald-400 font-bold truncate select-all">
                  {plan.setupCommand}
                </code>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(plan.setupCommand!, 'cmd')}
                className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[10px] font-sans font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedCommand ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Same-Generation Live In-Place Edition Switch */
        <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Direct In-Place SKU Edition Conversion Available!
                </h4>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300">
                Because <strong>{currentHostOS}</strong> and <strong>{targetEdition.displayOS}</strong> share
                the same OS kernel generation, you can switch editions immediately without reformatting or
                losing any files!
              </p>
            </div>

            <button
              type="button"
              onClick={onConvert}
              disabled={isProcessing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span>{isProcessing ? 'Converting...' : 'Convert Edition Now'}</span>
            </button>
          </div>

          {matchingIso && (
            <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
              <span className="text-[11px]">
                Need a standalone recovery ISO? Official ISO: {matchingIso.versionName} ({matchingIso.fileSize})
              </span>
              <a
                href={matchingIso.directDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 dark:text-emerald-300 font-semibold hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                <span>Download ISO</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
