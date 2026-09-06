import React, { useState } from 'react';
import {
  ChevronDown,
  Key,
  Cpu,
  ShieldCheck,
  Search,
  X,
} from 'lucide-react';
import { SystemEditionItem, LanguageCode } from '../types';
import { translations } from '../translations';

interface SettingsCardProps {
  language: LanguageCode;
  isAuto: boolean;
  onSetAuto: (val: boolean) => void;
  editions: SystemEditionItem[];
  selectedEditionIndex: number;
  onSelectEdition: (index: number) => void;
  manualKey: string;
  onManualKeyChange: (val: string) => void;
  isKeyValid: boolean;
  onActivate: () => void;
  onConvert: () => void;
  onOpenUpgradeFull: () => void;
  onOpenHotpatch: () => void;
  isProcessing: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  language,
  isAuto,
  onSetAuto,
  editions,
  selectedEditionIndex,
  onSelectEdition,
  manualKey,
  onManualKeyChange,
  isKeyValid,
  onActivate,
  onConvert,
  onOpenUpgradeFull,
  onOpenHotpatch,
  isProcessing,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [archFilter, setArchFilter] = useState<'all' | 'x64' | 'x86'>('all');

  const currentEdition = editions[selectedEditionIndex] || editions[0];

  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length > 25) raw = raw.slice(0, 25);

    // Format as XXXXX-XXXXX-XXXXX-XXXXX-XXXXX
    const parts = raw.match(/.{1,5}/g) || [];
    const formatted = parts.join('-');
    onManualKeyChange(formatted);
  };

  const getMethodBadge = (item: SystemEditionItem) => {
    switch (item.method) {
      case 'hwid':
        return {
          label: t.Method_HWID,
          bg: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300/50',
        };
      case 'kms38':
        return {
          label: t.Method_KMS38,
          bg: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300/50',
        };
      case 'kms':
        return {
          label: t.Method_KMS,
          bg: 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border-blue-300/50',
        };
      case 'oem_slic':
        return {
          label: t.Method_SLIC,
          bg: 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300/50',
        };
      case 'legacy_vl':
        return {
          label: t.Method_Legacy,
          bg: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300/50',
        };
      case 'avma':
        return {
          label: t.Method_AVMA,
          bg: 'bg-cyan-100 dark:bg-cyan-950/70 text-cyan-800 dark:text-cyan-300 border-cyan-300/50',
        };
      default:
        return {
          label: 'Standard',
          bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-300/50',
        };
    }
  };

  const currentBadge = getMethodBadge(currentEdition);

  // Filter editions based on architecture and search query
  const filteredEditions = editions.filter((ed) => {
    // Architecture filter
    if (archFilter === 'x64') {
      if (ed.arch && !ed.arch.includes('x64')) return false;
    } else if (archFilter === 'x86') {
      if (ed.arch && !ed.arch.includes('x86')) return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = ed.displayOS.toLowerCase().includes(q);
      const matchKey = ed.key.toLowerCase().includes(q);
      const matchFamily = ed.family.toLowerCase().includes(q);
      const matchSku = ed.sku.toLowerCase().includes(q);
      const matchYear = (ed.releaseYear || '').toLowerCase().includes(q);
      const matchArch = (ed.arch || '').toLowerCase().includes(q);
      const matchCategory = (ed.category || '').toLowerCase().includes(q);
      return matchName || matchKey || matchFamily || matchSku || matchYear || matchArch || matchCategory;
    }
    return true;
  });

  // Groups for standard presentation
  const editionGroups = [
    {
      label: '── Windows 11 Editions (x64 / ARM64) ──',
      items: filteredEditions.filter((e) => e.family === 'win11' || (e.family === 'win10_11' && e.displayOS.includes('Windows 11'))),
    },
    {
      label: '── Windows 11 LTSC & Evaluation ──',
      items: filteredEditions.filter(
        (e) => (e.family === 'ltsc' || e.family === 'eval') && e.displayOS.includes('Windows 11')
      ),
    },
    {
      label: '── Windows 10 Editions (x64 & x86 / 32-bit) ──',
      items: filteredEditions.filter(
        (e) =>
          (e.family === 'win10' || (e.family === 'win10_11' && e.displayOS.includes('Windows 10'))) &&
          !e.displayOS.includes('LTSC') &&
          !e.displayOS.includes('LTSB') &&
          !e.displayOS.includes('Evaluation')
      ),
    },
    {
      label: '── Windows 10 LTSC, LTSB & Evaluation ──',
      items: filteredEditions.filter(
        (e) => (e.family === 'ltsc' || e.family === 'eval') && (e.displayOS.includes('Windows 10') || e.displayOS.includes('LTSB'))
      ),
    },
    {
      label: '── Windows Technical Preview (x64 & x86) ──',
      items: filteredEditions.filter((e) => e.family === 'preview' || e.displayOS.includes('Technical Preview')),
    },
    {
      label: '── Windows 8.1 Editions (x64 & x86) ──',
      items: filteredEditions.filter(
        (e) => e.family === 'win8' && e.displayOS.includes('8.1')
      ),
    },
    {
      label: '── Windows 8 Editions (32-bit & 64-bit) ──',
      items: filteredEditions.filter(
        (e) => e.family === 'win8' && !e.displayOS.includes('8.1')
      ),
    },
    {
      label: '── Windows 7 Editions (x64 & x86) ──',
      items: filteredEditions.filter((e) => e.family === 'win7'),
    },
    {
      label: '── Windows IoT & Embedded Lineup ──',
      items: filteredEditions.filter((e) => e.family === 'iot'),
    },
    {
      label: '── Windows Server Editions (2005 - 2025) ──',
      items: filteredEditions.filter((e) => e.family === 'server'),
    },
  ];

  return (
    <div className="w-full max-w-[540px] mx-auto flex flex-col space-y-4">
      {/* Fluent SettingsCard Frame */}
      <div className="bg-white dark:bg-[#2b2b2b] rounded-xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-xs p-5 sm:p-6 transition-all">
        {/* Mode & SKU Header */}
        <div className="mb-2.5 flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block tracking-tight">
            {isAuto ? t.Select_target_SKU : t.Input_target_SKU}
          </label>
          {isAuto && (
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
              {filteredEditions.length} / {editions.length} editions
            </span>
          )}
        </div>

        {/* Architecture & Quick Search Filter Controls (Auto Mode) */}
        {isAuto && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between gap-2">
              {/* Architecture Selector Tabs */}
              <div className="inline-flex rounded-lg p-0.5 bg-neutral-100 dark:bg-[#202020] border border-neutral-200 dark:border-neutral-700/80 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setArchFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    archFilter === 'all'
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  All Arch
                </button>
                <button
                  type="button"
                  onClick={() => setArchFilter('x64')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    archFilter === 'x64'
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  x64 (64-bit)
                </button>
                <button
                  type="button"
                  onClick={() => setArchFilter('x86')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    archFilter === 'x86'
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  x86 / x32 (32-bit)
                </button>
              </div>

              {/* Quick Search Field */}
              <div className="relative flex-1 max-w-[210px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter editions..."
                  className="w-full bg-neutral-50 dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-md pl-7 pr-6 py-1 text-[11px] text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Input / Dropdown Area */}
        <div className="relative mb-3">
          {isAuto ? (
            <div className="relative">
              <select
                value={selectedEditionIndex}
                onChange={(e) => onSelectEdition(Number(e.target.value))}
                disabled={isProcessing}
                className="w-full appearance-none bg-neutral-50 dark:bg-[#202020] border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-10 cursor-pointer disabled:opacity-50 font-sans"
              >
                {/* When filtering, if any group has items, render it */}
                {editionGroups.map((group) => {
                  if (group.items.length === 0) return null;
                  return (
                    <optgroup key={group.label} label={group.label}>
                      {group.items.map((ed) => (
                        <option key={ed.id} value={editions.indexOf(ed)}>
                          {ed.displayOS} [{ed.arch || 'x64'} · {ed.releaseYear || 'All'}] ({ed.key})
                        </option>
                      ))}
                    </optgroup>
                  );
                })}

                {/* If filtered list is empty, show no match option */}
                {filteredEditions.length === 0 && (
                  <option disabled value={-1}>
                    No editions found matching &quot;{searchQuery}&quot;
                  </option>
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Key className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={manualKey}
                onChange={handleKeyInput}
                disabled={isProcessing}
                maxLength={29}
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                className={`w-full bg-neutral-50 dark:bg-[#202020] border rounded-lg pl-9 pr-4 py-2.5 text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 transition-colors disabled:opacity-50 ${
                  manualKey.length > 0 && !isKeyValid
                    ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                    : 'border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {manualKey.length > 0 && (
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isKeyValid
                      ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {isKeyValid ? '25/25' : `${manualKey.replace(/-/g, '').length}/25`}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Selected Profile Metadata Tags */}
        {isAuto && currentEdition && (
          <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span
              className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${currentBadge.bg}`}
            >
              {currentBadge.label}
            </span>
            {currentEdition.arch && (
              <span className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono font-medium bg-neutral-50 dark:bg-neutral-800">
                Arch: {currentEdition.arch}
              </span>
            )}
            {currentEdition.releaseYear && (
              <span className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[10px] font-mono">
                Year: {currentEdition.releaseYear}
              </span>
            )}
            <span className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[10px] font-mono">
              SKU: {currentEdition.sku}
            </span>
            {currentEdition.buildNumber && (
              <span className="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-[10px] font-mono">
                Build: {currentEdition.buildNumber}
              </span>
            )}
          </div>
        )}

        {/* Radio Mode Selection */}
        <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 dark:border-neutral-800">
          <label className="inline-flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <input
              type="radio"
              name="mode"
              checked={isAuto}
              onChange={() => onSetAuto(true)}
              disabled={isProcessing}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-neutral-300 dark:border-neutral-600"
            />
            <span>{t.Auto_Mode}</span>
          </label>

          <label className="inline-flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <input
              type="radio"
              name="mode"
              checked={!isAuto}
              onChange={() => onSetAuto(false)}
              disabled={isProcessing}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-neutral-300 dark:border-neutral-600"
            />
            <span>{t.Manual_Mode}</span>
          </label>
        </div>
      </div>

      {/* Main Action Buttons Matching WPF Heights & Colors */}
      <div className="flex flex-col space-y-2.5">
        {/* Activate Button (Accent Primary) */}
        <button
          onClick={onActivate}
          disabled={isProcessing || (!isAuto && !isKeyValid)}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{t.Activate_Button}</span>
        </button>

        {/* Convert Versions Button */}
        <button
          onClick={onConvert}
          disabled={isProcessing || (!isAuto && !isKeyValid)}
          className="w-full h-10 bg-white dark:bg-[#2b2b2b] hover:bg-neutral-100 dark:hover:bg-neutral-700/80 active:bg-neutral-200 dark:active:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-lg text-xs font-medium transition-all shadow-2xs flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Cpu className="w-4 h-4 text-neutral-500" />
          <span>{t.Convert_versions}</span>
        </button>

        {/* Upgrade Full Version Button */}
        <button
          onClick={onOpenUpgradeFull}
          disabled={isProcessing}
          className="w-full h-10 bg-white dark:bg-[#2b2b2b] hover:bg-neutral-100 dark:hover:bg-neutral-700/80 active:bg-neutral-200 dark:active:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-lg text-xs font-medium transition-all shadow-2xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{t.Upgrade_full_version}</span>
        </button>

        {/* Rebootless Update (Hotpatch) Button */}
        <button
          onClick={onOpenHotpatch}
          disabled={isProcessing}
          className="w-full h-10 bg-white dark:bg-[#2b2b2b] hover:bg-neutral-100 dark:hover:bg-neutral-700/80 active:bg-neutral-200 dark:active:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-100 rounded-lg text-xs font-medium transition-all shadow-2xs flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <span>{t.Rebootless_update_management}</span>
        </button>
      </div>
    </div>
  );
};
