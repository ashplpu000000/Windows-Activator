import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Key,
  Laptop,
  ShieldCheck,
  ShieldAlert,
  Search,
  X,
  Pin,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Sparkles,
  Terminal,
  Cpu,
  Layers,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Disc,
  ArrowRight,
  Download,
} from 'lucide-react';
import { SystemEditionItem, LanguageCode } from '../types';
import { translations } from '../translations';
import { validateAndRecognizeKey, formatProductKeyInput } from '../utils/keyValidator';
import { DetectedSystemInfo } from '../utils/systemDetector';
import { VersionSwitcherCard } from './VersionSwitcherCard';
import { windowsIsoCatalog } from '../data/windowsIsos';
import { IsoCatalogView } from './IsoCatalogView';

export type MainTabMode = 'auto' | 'manual' | 'convert' | 'iso';

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
  onOpenKeyChecker?: () => void;
  onOpenIsoCenter?: (targetOS?: string) => void;
  showLogs?: boolean;
  onToggleLogs?: () => void;
  detectedSystem?: DetectedSystemInfo | null;
  isDetecting?: boolean;
  onAutoDetect?: () => void;
  isActivated?: boolean;
  onToggleActivated?: () => void;
  onSetDetectedEdition?: (editionName: string, index?: number) => void;
  onOpenStatus?: () => void;
  onOpenXpTool?: () => void;
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
  isKeyValid: _isKeyValid,
  onActivate,
  onConvert,
  onOpenUpgradeFull,
  onOpenHotpatch,
  isProcessing,
  onOpenKeyChecker,
  onOpenIsoCenter,
  showLogs,
  onToggleLogs,
  detectedSystem,
  isDetecting,
  onAutoDetect,
  isActivated = false,
  onToggleActivated,
  onSetDetectedEdition,
  onOpenStatus: _onOpenStatus,
  onOpenXpTool,
}) => {
  const t = translations[language];

  // Active top navigation tab (auto, manual, convert)
  const [activeTab, setActiveTab] = useState<MainTabMode>(isAuto ? 'auto' : 'manual');
  const [searchQuery, setSearchQuery] = useState('');
  const [archFilter, setArchFilter] = useState<'all' | 'x64' | 'x86' | 'arm64'>('all');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle?: string; type: 'success' | 'info' } | null>(null);
  const [copiedKeyText, setCopiedKeyText] = useState(false);

  // Customer-selected pinned SKU IDs (no editions pinned by default)
  const [pinnedIds, setPinnedIds] = useState<number[]>(() => {
    try {
      // Clear previous hardcoded default array if it exists
      if (localStorage.getItem('win_activator_pinned_skus')) {
        localStorage.removeItem('win_activator_pinned_skus');
      }
      const saved = localStorage.getItem('win_activator_user_pinned_skus');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const currentEdition: SystemEditionItem | null =
    selectedEditionIndex >= 0 && selectedEditionIndex < editions.length
      ? editions[selectedEditionIndex]
      : null;

  // Sync isAuto prop when tab changes
  const handleTabChange = (tab: MainTabMode) => {
    setActiveTab(tab);
    if (tab === 'manual') {
      onSetAuto(false);
    } else {
      onSetAuto(true);
    }
  };

  const showToast = (title: string, subtitle?: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ title, subtitle, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.title === title ? null : prev));
    }, 2600);
  };

  const togglePinEdition = (id: number) => {
    setPinnedIds((prev) => {
      const isCurrentlyPinned = prev.includes(id);
      const next = isCurrentlyPinned ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem('win_activator_user_pinned_skus', JSON.stringify(next));
      } catch {
        // ignore
      }
      showToast(
        !isCurrentlyPinned ? 'Edition Pinned to Quick Access' : 'Edition Unpinned',
        editions.find((e) => e.id === id)?.displayOS
      );
      return next;
    });
  };

  const clearAllPinned = () => {
    setPinnedIds([]);
    try {
      localStorage.setItem('win_activator_user_pinned_skus', JSON.stringify([]));
    } catch {
      // ignore
    }
    showToast('Pinned List Cleared', 'All quick access pins removed');
  };

  const handleKeyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatProductKeyInput(e.target.value);
    onManualKeyChange(formatted);
    const recognition = validateAndRecognizeKey(formatted, editions, currentEdition?.family);
    if (recognition.isValid && recognition.matchedEditionIndex >= 0) {
      onSelectEdition(recognition.matchedEditionIndex);
    }
  };

  // Channel & Branch metadata detection
  const releaseChannel = useMemo(() => {
    if (!currentEdition) return 'Windows Operating System';
    switch (currentEdition.method) {
      case 'hwid':
        return 'Digital License (HWID)';
      case 'kms':
        return 'Volume (GVLK)';
      case 'kms38':
        return 'Volume KMS38 (2038)';
      case 'oem_slic':
        return 'OEM:SLIC 2.1';
      case 'avma':
        return 'Hyper-V AVMA';
      case 'legacy_vl':
        return 'Volume License (VLK)';
      default:
        return 'Volume License';
    }
  }, [currentEdition]);

  const servicingBranch = useMemo(() => {
    if (!currentEdition) return 'General Availability Channel (GA)';
    const name = currentEdition.displayOS.toLowerCase();
    if (name.includes('ltsc') || name.includes('ltsb')) {
      return 'Long-Term Servicing Channel (LTSC)';
    }
    if (name.includes('semi-annual') || name.includes('sac')) {
      return 'Semi-Annual Channel (SAC)';
    }
    if (currentEdition.family === 'server') {
      return 'Long-Term Servicing Channel (Server)';
    }
    if (currentEdition.family === 'iot') {
      return 'IoT Enterprise Specialized';
    }
    return 'General Availability Channel (GA)';
  }, [currentEdition]);

  const productFamily = useMemo(() => {
    if (!currentEdition) return 'Microsoft Windows';
    if (currentEdition.family === 'server') return 'Windows Server NT';
    if (currentEdition.family === 'iot') return 'Windows IoT / Embedded';
    return 'Windows NT (Desktop Client)';
  }, [currentEdition]);

  const getMethodBadge = (item: SystemEditionItem) => {
    switch (item.method) {
      case 'hwid':
        return {
          label: 'HWID Digital',
          bg: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        };
      case 'kms38':
        return {
          label: 'KMS38 Ticket',
          bg: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
        };
      case 'kms':
        return {
          label: 'KMS / GVLK',
          bg: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
        };
      case 'oem_slic':
        return {
          label: 'OEM SLIC 2.1',
          bg: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
        };
      case 'legacy_vl':
        return {
          label: 'Volume PID',
          bg: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
        };
      case 'avma':
        return {
          label: 'Hyper-V AVMA',
          bg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
        };
      default:
        return {
          label: 'Standard',
          bg: 'bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-500/30',
        };
    }
  };

  const currentBadge = currentEdition
    ? getMethodBadge(currentEdition)
    : {
        label: 'Select Edition',
        bg: 'bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border-neutral-500/30',
      };

  // Copy full SKU Info
  const handleCopySkuInfo = () => {
    if (!currentEdition) {
      showToast('No Edition Selected', 'Please choose a Windows edition first', 'info');
      return;
    }
    const text = [
      `Product Edition: ${currentEdition.displayOS}`,
      `Product Key: ${currentEdition.key}`,
      `SKU ID: ${currentEdition.sku}`,
      `Architecture: ${currentEdition.arch || 'x64'}`,
      `Release Year: ${currentEdition.releaseYear || 'N/A'}`,
      `Activation Method: ${currentEdition.method.toUpperCase()} (${currentBadge.label})`,
      `Product Family: ${productFamily}`,
      `Release Channel: ${releaseChannel}`,
      `Servicing Branch: ${servicingBranch}`,
      `NT Kernel: ${currentEdition.ntKernel || '10.0'}`,
      `Build Number: ${currentEdition.buildNumber || 'N/A'}`,
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedKeyText(true);
    showToast('SKU Information Copied', 'All deployment specs copied to clipboard');
    setTimeout(() => setCopiedKeyText(false), 2000);
  };

  // Export SKU list as CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'DisplayOS', 'Key', 'SKU', 'Family', 'Method', 'Architecture', 'Year', 'Kernel', 'Build'];
    const rows = editions.map((e) => [
      e.id,
      `"${e.displayOS.replace(/"/g, '""')}"`,
      e.key,
      e.sku,
      e.family,
      e.method,
      `"${e.arch || ''}"`,
      `"${e.releaseYear || ''}"`,
      `"${e.ntKernel || ''}"`,
      `"${e.buildNumber || ''}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `windows_activation_skus_${editions.length}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV Exported Successfully', `${editions.length} verified SKUs exported`);
  };

  // Export SKU list as JSON
  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(editions, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `windows_activation_skus_${editions.length}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('JSON Exported Successfully', `${editions.length} verified SKUs exported`);
  };

  // Filtered editions based on architecture and search query
  const filteredEditions = useMemo(() => {
    return editions.filter((ed) => {
      // Pinned only filter
      if (showPinnedOnly && !pinnedIds.includes(ed.id)) return false;

      // Architecture filter
      if (archFilter === 'x64') {
        if (ed.arch && !ed.arch.includes('x64')) return false;
      } else if (archFilter === 'x86') {
        if (ed.arch && !ed.arch.includes('x86')) return false;
      } else if (archFilter === 'arm64') {
        if (ed.arch && !ed.arch.includes('arm64')) return false;
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
        const matchBuild = (ed.buildNumber || '').toLowerCase().includes(q);
        return matchName || matchKey || matchFamily || matchSku || matchYear || matchArch || matchBuild;
      }
      return true;
    });
  }, [editions, showPinnedOnly, pinnedIds, archFilter, searchQuery]);

  // Edition groups
  const editionGroups = [
    {
      label: '── Windows 11 Editions (x64 / ARM64) ──',
      items: filteredEditions.filter((e) => e.family === 'win11' || (e.family === 'win10_11' && e.displayOS.includes('Windows 11'))),
    },
    {
      label: '── Windows 11 / 10 LTSC & LTSB Lineup ──',
      items: filteredEditions.filter((e) => e.family === 'ltsc' || e.category === 'ltsc'),
    },
    {
      label: '── Windows 10 Editions (x64 & x86) ──',
      items: filteredEditions.filter(
        (e) => (e.family === 'win10' || (e.family === 'win10_11' && e.displayOS.includes('Windows 10'))) && e.category !== 'ltsc'
      ),
    },
    {
      label: '── Windows Server 2025 / 2022 / 2019 / 2016 ──',
      items: filteredEditions.filter((e) => e.family === 'server' && e.method !== 'avma'),
    },
    {
      label: '── Windows Server Hyper-V AVMA Keys ──',
      items: filteredEditions.filter((e) => e.method === 'avma'),
    },
    {
      label: '── Windows 8.1 & Windows 8 Editions ──',
      items: filteredEditions.filter((e) => e.family === 'win8'),
    },
    {
      label: '── Windows 7 & POSReady Editions ──',
      items: filteredEditions.filter((e) => e.family === 'win7'),
    },
    {
      label: '── Windows Vista & Legacy Editions ──',
      items: filteredEditions.filter((e) => e.family === 'vista'),
    },
    {
      label: '── Windows XP Editions (Professional, Home, Media Center, x64, POSReady, Embedded) ──',
      items: filteredEditions.filter((e) => e.family === 'winxp'),
    },
    {
      label: '── Windows IoT & Embedded Specialized ──',
      items: filteredEditions.filter((e) => e.family === 'iot'),
    },
    {
      label: '── All Other Windows Editions & Specialized SKUs ──',
      items: filteredEditions.filter(
        (e) =>
          e.family !== 'win11' &&
          e.family !== 'win10' &&
          e.family !== 'win10_11' &&
          e.family !== 'ltsc' &&
          e.category !== 'ltsc' &&
          e.family !== 'server' &&
          e.method !== 'avma' &&
          e.family !== 'win8' &&
          e.family !== 'win7' &&
          e.family !== 'vista' &&
          e.family !== 'winxp' &&
          e.family !== 'iot'
      ),
    },
  ];

  // Manual key validation and edition recognition against database & genuine registry
  const keyRecognition = useMemo(() => {
    return validateAndRecognizeKey(manualKey, editions, currentEdition?.family);
  }, [manualKey, editions, currentEdition?.family]);

  return (
    <div className="w-full mx-auto flex flex-col space-y-3 sm:space-y-3.5">
      {/* ========================================================================= */}
      {/* 1. TOP SEGMENTED NAVIGATION TABS (Auto, Manual, Convert, Key Inspector)   */}
      {/* ========================================================================= */}
      <div className="bg-neutral-100/90 dark:bg-[#1f1f23]/90 p-1.5 sm:p-2 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 backdrop-blur-md grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 select-none shadow-xs">
        <button
          type="button"
          onClick={() => handleTabChange('auto')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'auto'
              ? 'bg-white dark:bg-[#2c2c32] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
          }`}
        >
          <Laptop className="w-4 h-4 shrink-0" />
          <span>{t.Auto_Mode}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('manual')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'manual'
              ? 'bg-white dark:bg-[#2c2c32] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
          }`}
        >
          <Sliders className="w-4 h-4 shrink-0" />
          <span>{t.Manual_Mode}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('convert')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'convert'
              ? 'bg-white dark:bg-[#2c2c32] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
          }`}
        >
          <RefreshCw className="w-4 h-4 shrink-0" />
          <span>Version Switcher</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('iso')}
          className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'iso'
              ? 'bg-white dark:bg-[#2c2c32] text-blue-600 dark:text-blue-400 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40'
          }`}
        >
          <Disc className="w-4 h-4 text-blue-500 shrink-0" />
          <span>Official ISO Downloads</span>
          <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full font-bold">
            {windowsIsoCatalog.length}
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenKeyChecker}
          className="flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/40 transition-all cursor-pointer whitespace-nowrap"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Key Inspector</span>
          <span className="ml-1 text-xs font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded-full font-bold">
            {editions.length}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CARD: TARGET SKU SELECTION / CONVERT / MANUAL KEY INPUT           */}
      {/* ========================================================================= */}
      <div
        className="bg-white dark:bg-[#252529] rounded-xl border border-neutral-200/90 dark:border-neutral-700/80 shadow-xs p-4 sm:p-4.5 transition-all"
        style={{ backgroundColor: 'var(--theme-card-bg)' }}
      >
        {/* Section Header */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">
              {activeTab === 'convert'
                ? 'Select Target SKU to Convert'
                : activeTab === 'manual'
                ? t.Input_target_SKU
                : t.Select_target_SKU}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {activeTab === 'convert'
                ? 'Convert existing Windows edition without reformatting or reinstalling'
                : activeTab === 'manual'
                ? 'Enter a genuine 25-character Base-24 product key'
                : 'Choose the target Windows edition / SKU you want to activate on this machine'}
            </p>
          </div>

          {activeTab !== 'manual' && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => currentEdition && togglePinEdition(currentEdition.id)}
                disabled={!currentEdition}
                title={
                  currentEdition
                    ? pinnedIds.includes(currentEdition.id)
                      ? `Unpin ${currentEdition.displayOS}`
                      : `Pin ${currentEdition.displayOS} to quick access`
                    : 'Select a Windows edition to pin'
                }
                className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  currentEdition && pinnedIds.includes(currentEdition.id)
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs hover:bg-blue-700'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 border-neutral-200 dark:border-neutral-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                {currentEdition && pinnedIds.includes(currentEdition.id) ? (
                  <>
                    <Pin className="w-3.5 h-3.5 fill-current text-white" />
                    <span>Pinned</span>
                  </>
                ) : (
                  <>
                    <Pin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Pin Edition</span>
                  </>
                )}
              </button>

              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono font-medium">
                {filteredEditions.length} / {editions.length}
              </span>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ISO DOWNLOADS / VERSION SWITCHER / AUTO / MANUAL VIEW                     */}
        {/* ========================================================================= */}
        {activeTab === 'iso' ? (
          <IsoCatalogView initialSearch="" />
        ) : activeTab === 'convert' ? (
          <VersionSwitcherCard
            currentHostOS={detectedSystem?.detectedEdition || detectedSystem?.osName || 'Windows 11 Home'}
            isActivated={isActivated}
            editions={editions}
            selectedEditionIndex={selectedEditionIndex}
            onSelectEdition={onSelectEdition}
            onConvert={onConvert}
            isProcessing={isProcessing}
            onOpenIsoCenter={onOpenIsoCenter || (() => {})}
          />
        ) : activeTab !== 'manual' ? (
          <div className="space-y-3">
            {/* Automatic Windows Version & Edition Detector Bar */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-neutral-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-[#1c1c20] border border-blue-200/90 dark:border-blue-800/60 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                      Automatic Windows Version & Edition Detector
                    </span>
                    {isDetecting ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 animate-pulse">
                        <RefreshCw className="w-3 h-3 animate-spin" /> Detecting host environment...
                      </span>
                    ) : detectedSystem?.isWindows ? (
                      isActivated ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700/60 shadow-2xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>Host: {detectedSystem.detectedEdition || detectedSystem.osName || 'Windows'} Activated</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60 shadow-2xs">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Host: {detectedSystem.detectedEdition || detectedSystem.osName || 'Windows'} Not Activated</span>
                        </span>
                      )
                    ) : detectedSystem && !detectedSystem.isWindows ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                        Host: {detectedSystem.osName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                        Host OS Not Scanned
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-600 dark:text-neutral-300 truncate mt-1 flex items-center gap-1.5 flex-wrap">
                    {detectedSystem?.isWindows ? (
                      <>
                        <span>
                          Detected Host:{' '}
                          <strong className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {detectedSystem.detectedEdition || detectedSystem.osName || 'Windows'}
                          </strong>{' '}
                          ({detectedSystem.architecture} · NT Kernel {detectedSystem.kernelVersion}
                          {detectedSystem.estimatedBuild ? ` · Build ${detectedSystem.estimatedBuild}` : ''})
                        </span>
                        <span className="text-neutral-400 dark:text-neutral-600 hidden sm:inline">•</span>
                        <span
                          className={`font-semibold inline-flex items-center gap-1 ${
                            isActivated
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          Status: {isActivated ? 'Activated (Genuine License)' : 'Not Activated (Grace Period / Needs Activation)'}
                        </span>
                      </>
                    ) : (
                      'Scan host operating system to identify Windows version, kernel, bitness, and activation status'
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                {onToggleActivated && detectedSystem?.isWindows && (
                  <button
                    type="button"
                    onClick={onToggleActivated}
                    title="Click to toggle activation status simulation"
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isActivated
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100'
                        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 hover:bg-amber-100'
                    }`}
                  >
                    {isActivated ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="whitespace-nowrap">Status: Activated</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span className="whitespace-nowrap">Status: Not Activated</span>
                      </>
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={onAutoDetect}
                  disabled={isDetecting || isProcessing}
                  className="w-full sm:w-auto px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
                  <span>{detectedSystem ? 'Re-scan Host OS' : 'Auto-Detect Host Windows'}</span>
                </button>
              </div>
            </div>

            {/* Quick Version Switcher & ISO Banner */}
            <div className="px-3.5 py-2 bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-neutral-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-[#1e1e24] border border-blue-200/70 dark:border-blue-800/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex items-center gap-2 truncate">
                <Disc className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">
                  Need to change installed OS (e.g. from {detectedSystem?.detectedEdition || 'Win 11'} to Windows XP, Win 7, Win 8, or Server 2025)?
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                {onOpenXpTool && (
                  <button
                    type="button"
                    onClick={onOpenXpTool}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Windows XP Activation Studio (Phone CID Generator, VLK Keys, WPA Offline Bypass)"
                  >
                    <Key className="w-3 h-3" />
                    <span>XP Activation Studio</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleTabChange('convert')}
                  className="px-2.5 py-1 bg-white dark:bg-[#25252b] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-blue-600 dark:text-blue-400 font-bold rounded-lg border border-blue-200 dark:border-blue-800/80 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Version Switcher</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('iso')}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Disc className="w-3 h-3" />
                  <span>Download ISOs</span>
                </button>
              </div>
            </div>

            {/* Quick Featured ISO Direct Links Bar */}
            <div className="p-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-neutral-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-[#1e1e24] rounded-xl border border-blue-200/60 dark:border-blue-800/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200">
                  <Download className="w-3.5 h-3.5 text-blue-500" />
                  <span>Official Microsoft Direct ISO Downloads:</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('iso')}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View All {windowsIsoCatalog.length} ISOs</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
                {[
                  { name: 'Win 11 24H2', size: '5.4 GB', url: 'https://software.download.prss.microsoft.com/dbazure/Win11_24H2_English_x64.iso' },
                  { name: 'Win 10 22H2', size: '5.7 GB', url: 'https://software.download.prss.microsoft.com/dbazure/Win10_22H2_English_x64v1.iso' },
                  { name: 'Server 2025', size: '5.2 GB', url: 'https://software-static.download.prss.microsoft.com/dbazure/26100.1742.240906-0331.ge_release_svc_refresh_SERVER_EVAL_x64FRE_en-us.iso' },
                  { name: 'Win 8.1 Pro', size: '4.0 GB', url: 'https://archive.org/download/win-8.1-english-x-64_202010/Win8.1_English_x64.iso' },
                  { name: 'Win 7 Ultimate', size: '3.1 GB', url: 'https://archive.org/download/windows-7-ultimate-sp1-x64-en-us/7601.24214.180801-1700.win7sp1_ldr_escrow_CLIENT_ULTIMATE_x64FRE_en-us.iso' },
                  { name: 'Win XP SP3', size: '589 MB', url: 'https://archive.org/download/en_windows_xp_professional_with_service_pack_3_x86_cd_x14-80428/en_windows_xp_professional_with_service_pack_3_x86_cd_x14-80428.iso' },
                ].map((quickIso) => (
                  <a
                    key={quickIso.name}
                    href={quickIso.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white dark:bg-[#25252b] hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-neutral-200 dark:border-neutral-700/80 rounded-lg flex flex-col items-center justify-center text-center transition-all group shadow-2xs"
                  >
                    <span className="font-bold text-[11px] text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {quickIso.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center gap-0.5 mt-0.5">
                      <Download className="w-2.5 h-2.5" />
                      {quickIso.size}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Candidate Edition Quick Select Pills */}
            {detectedSystem && detectedSystem.candidateEditions.length > 0 && (
              <div className="p-2.5 bg-neutral-100/80 dark:bg-[#1e1e24] rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1 shrink-0">
                  <Laptop className="w-3.5 h-3.5 text-blue-500" />
                  Detected Candidates for {detectedSystem.osName}:
                </span>
                {detectedSystem.candidateEditions.slice(0, 6).map((cand) => (
                  <button
                    key={cand.edition.id}
                    type="button"
                    onClick={() => {
                      onSelectEdition(cand.index);
                      if (onSetDetectedEdition) {
                        onSetDetectedEdition(cand.edition.displayOS, cand.index);
                      }
                      showToast(
                        'Host Edition Selected',
                        `${cand.edition.displayOS} — ${isActivated ? 'Activated' : 'Not Activated'}`,
                      );
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                      selectedEditionIndex === cand.index
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white dark:bg-[#2b2b31] border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {cand.edition.displayOS}
                  </button>
                ))}
              </div>
            )}

            {/* Quick Search & Architecture Filter Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* Search Field */}
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKUs — Pro, 22621, x64, LTSC..."
                  className="w-full h-10 sm:h-10.5 bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-300 dark:border-neutral-700 rounded-lg pl-8.5 pr-7 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Architecture Selector Tabs */}
              <div className="inline-flex rounded-lg p-0.5 bg-neutral-100 dark:bg-[#1c1c20] border border-neutral-200 dark:border-neutral-700/80 text-xs shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setArchFilter('all')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    archFilter === 'all'
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setArchFilter('x64')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    archFilter === 'x64'
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  x64
                </button>
                <button
                  type="button"
                  onClick={() => setArchFilter('x86')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    archFilter === 'x86'
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  x86
                </button>
                <button
                  type="button"
                  onClick={() => setArchFilter('arm64')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                    archFilter === 'arm64'
                      ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  ARM64
                </button>
              </div>
            </div>

            {/* Custom Styled Dropdown & Inlined Metadata Badges */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
              <div className="relative flex-1 min-w-0">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500 dark:text-blue-400">
                  <Laptop className="w-4 h-4" />
                </div>
                <select
                  value={selectedEditionIndex}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val === -999) {
                      onAutoDetect?.();
                    } else {
                      onSelectEdition(val);
                      if (onSetDetectedEdition && editions[val]) {
                        onSetDetectedEdition(editions[val].displayOS, val);
                      }
                    }
                  }}
                  disabled={isProcessing}
                  className="w-full h-10.5 sm:h-11 appearance-none bg-neutral-50 dark:bg-[#1c1c20] border border-neutral-300 dark:border-neutral-700 rounded-lg pl-9 pr-9 text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {selectedEditionIndex < 0 && (
                    <option value={-1}>
                      ⚡ No Edition Chosen — Auto-Detect Host or Select Below...
                    </option>
                  )}
                  <option value={-999} className="font-bold text-blue-600 dark:text-blue-400">
                    ⚡ [Run Automatic Windows Version & Edition Detector]
                  </option>

                  {editionGroups.map((group) => {
                    if (group.items.length === 0) return null;
                    return (
                      <optgroup key={group.label} label={group.label}>
                        {group.items.map((ed) => (
                          <option key={ed.id} value={editions.indexOf(ed)}>
                            {ed.displayOS} [{ed.arch || 'x64'}{ed.releaseYear ? ` · ${ed.releaseYear}` : ''}] ({ed.key})
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}

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

              {/* Metadata Badges inlined next to dropdown in wide layout */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs shrink-0">
                {currentEdition ? (
                  <>
                    <span className={`px-2 py-1 rounded-md border text-xs font-semibold flex items-center gap-1 ${currentBadge.bg}`}>
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      {currentBadge.label}
                    </span>
                    {currentEdition.arch && (
                      <span className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-mono font-medium bg-neutral-50 dark:bg-neutral-800">
                        Arch: {currentEdition.arch}
                      </span>
                    )}
                    {currentEdition.releaseYear && (
                      <span className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-mono bg-neutral-50 dark:bg-neutral-800">
                        Year: {currentEdition.releaseYear}
                      </span>
                    )}
                    <span className="px-2 py-1 rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-mono bg-neutral-50 dark:bg-neutral-800">
                      SKU: {currentEdition.sku}
                    </span>
                  </>
                ) : (
                  <span className="px-2.5 py-1 rounded-md border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    No Edition Chosen (Click Auto-Detect or Choose)
                  </span>
                )}
              </div>
            </div>

            {/* ========================================================================= */}
            {/* PINNED SKUS QUICK ACCESS BAR (Customer-Controlled)                        */}
            {/* ========================================================================= */}
            <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                  <Pin className={`w-3.5 h-3.5 ${pinnedIds.length > 0 ? 'text-blue-500' : 'text-neutral-400'}`} />
                  Pinned SKUs:
                </span>

                {pinnedIds.length > 0 ? (
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                      className={`text-[11px] font-medium px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                        showPinnedOnly
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300'
                      }`}
                    >
                      {showPinnedOnly ? 'Show All' : 'Filter Pinned'}
                    </button>
                    <button
                      type="button"
                      onClick={clearAllPinned}
                      className="text-[11px] text-neutral-400 hover:text-red-500 dark:hover:text-red-400 cursor-pointer transition-colors"
                      title="Remove all pinned editions"
                    >
                      Clear All
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500 italic">
                    None pinned (Customer&apos;s choice to pin versions)
                  </span>
                )}
              </div>

              {pinnedIds.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {pinnedIds.map((pid) => {
                    const ed = editions.find((e) => e.id === pid);
                    if (!ed) return null;
                    const isSelected = currentEdition ? ed.id === currentEdition.id : false;
                    const idx = editions.indexOf(ed);

                    return (
                      <div
                        key={ed.id}
                        className={`inline-flex items-center rounded-md border text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 shadow-2xs font-bold'
                            : 'bg-neutral-50 dark:bg-[#1f1f23] text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectEdition(idx)}
                          className="pl-2.5 pr-1.5 py-1.5 flex items-center gap-1.5 cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          ) : (
                            <Laptop className="w-3 h-3 text-neutral-400" />
                          )}
                          <span>{ed.displayOS}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePinEdition(ed.id);
                          }}
                          title={`Unpin ${ed.displayOS}`}
                          className="pr-2 pl-0.5 py-1.5 text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : currentEdition ? (
                <button
                  type="button"
                  onClick={() => togglePinEdition(currentEdition.id)}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/50 px-2 py-1 rounded-md border border-dashed border-blue-300 dark:border-blue-700/60 flex items-center gap-1 self-start md:self-auto cursor-pointer transition-colors"
                  title={`Pin ${currentEdition.displayOS}`}
                >
                  <Pin className="w-3 h-3" />
                  <span>Pin {currentEdition.displayOS}</span>
                </button>
              ) : (
                <span className="text-xs text-neutral-400 dark:text-neutral-500 italic">
                  Select an edition to pin
                </span>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* MANUAL MODE KEY INPUT VIEW                                                */
          /* ========================================================================= */
          <div className="space-y-3">
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
                className={`w-full h-10.5 sm:h-11 bg-neutral-50 dark:bg-[#1c1c20] border rounded-lg pl-9 pr-32 text-xs sm:text-sm font-mono text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 transition-colors disabled:opacity-50 ${
                  manualKey.length > 0 && !keyRecognition.isValid && (keyRecognition.isComplete || keyRecognition.hasIllegalChars)
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500 dark:border-red-500'
                    : keyRecognition.isValid && keyRecognition.isRecognized
                    ? 'border-emerald-500 focus:ring-emerald-400 focus:border-emerald-500 dark:border-emerald-500'
                    : 'border-neutral-300 dark:border-neutral-700 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {manualKey.length > 0 && (
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold px-2 py-0.5 rounded ${
                    keyRecognition.isValid && keyRecognition.isRecognized
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                      : keyRecognition.hasIllegalChars
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                      : keyRecognition.isComplete
                      ? 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  }`}
                >
                  {keyRecognition.isValid && keyRecognition.isRecognized
                    ? '✓ Genuine Key'
                    : keyRecognition.hasIllegalChars
                    ? 'Illegal Chars'
                    : keyRecognition.isComplete
                    ? 'Invalid Key'
                    : `${manualKey.replace(/[^A-Za-z0-9]/g, '').length}/25`}
                </span>
              )}
            </div>

            {/* 1. RECOGNIZED GENUINE PRODUCT KEY CARD */}
            {keyRecognition.isValid && keyRecognition.isRecognized && keyRecognition.matchedEdition && (
              <div className="p-3 bg-emerald-50/90 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl space-y-2.5 text-xs animate-in fade-in duration-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-emerald-950 dark:text-emerald-100">
                          {keyRecognition.matchedEdition.displayOS}
                        </span>
                        <span className="px-1.5 py-0.2 bg-emerald-200/80 dark:bg-emerald-800/60 text-emerald-900 dark:text-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider">
                          Genuine Microsoft Key
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 dark:text-emerald-300/90 mt-0.5">
                        License Channel: <span className="font-semibold">{keyRecognition.detectedChannel}</span> · SKU ID: <span className="font-mono font-semibold">{keyRecognition.matchedEdition.sku}</span> · Method: <span className="font-semibold uppercase">{keyRecognition.matchedEdition.method}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleTabChange('auto');
                      showToast('Switched to Auto Mode', keyRecognition.matchedEdition?.displayOS);
                    }}
                    className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer shrink-0"
                  >
                    View in Catalog →
                  </button>
                </div>

                {/* If key matches both Windows 10 & 11 (e.g. Home or Pro GVLK), provide instant edition picker */}
                {keyRecognition.alternativeEditions && keyRecognition.alternativeEditions.length > 1 && (
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-emerald-900 dark:text-emerald-200">
                      Select Target Edition:
                    </span>
                    {keyRecognition.alternativeEditions.map(({ edition: altEd, index: altIdx }) => (
                      <button
                        key={altEd.id}
                        type="button"
                        onClick={() => {
                          onSelectEdition(altIdx);
                          showToast('Target Edition Set', altEd.displayOS);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-md font-medium cursor-pointer transition-all ${
                          currentEdition?.id === altEd.id
                            ? 'bg-emerald-700 text-white font-bold shadow-xs'
                            : 'bg-white/90 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-800/50'
                        }`}
                      >
                        {altEd.displayOS}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. UNRECOGNIZED / RANDOM / COUNTERFEIT KEY WARNING */}
            {keyRecognition.isComplete && !keyRecognition.isValid && !keyRecognition.hasIllegalChars && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-xl space-y-1.5 text-xs text-red-900 dark:text-red-200 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4.5 h-4.5 text-red-500 shrink-0" />
                  <span className="font-bold text-sm text-red-800 dark:text-red-200">
                    Invalid / Unrecognized Product Key
                  </span>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                  This product key was verified against Microsoft Software Protection Platform (sppsvc.exe) and rejected. The key is not registered to any genuine Windows edition or license channel. Activation cannot proceed with an invalid key.
                </p>
              </div>
            )}

            {/* 3. ILLEGAL CHARACTERS WARNING */}
            {keyRecognition.hasIllegalChars && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-300 dark:border-red-800 rounded-xl text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5 animate-in fade-in duration-200">
                <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-800 dark:text-red-200">
                    Illegal Characters: {keyRecognition.illegalChars.join(', ')}
                  </div>
                  <div className="text-[11px] text-red-700 dark:text-red-300 mt-0.5">
                    Microsoft Windows 5x5 product keys only use 24 specific alphanumeric characters and never include 0, 1, 5, A, E, I, L, O, S, U, or Z.
                  </div>
                </div>
              </div>
            )}

            {/* 4. QUICK TEST KEYS (Helps customer easily test and verify) */}
            <div className="p-2.5 bg-neutral-100/70 dark:bg-[#1f1f23]/60 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Quick Key Testers:
                </span>
                <button
                  type="button"
                  onClick={onOpenKeyChecker}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  Browse All {editions.length} Keys
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const k = 'TX9XD-98N7V-6WMQ6-BX7FG-H8Q99';
                    onManualKeyChange(k);
                    const win10HomeIdx = editions.findIndex(
                      (e) => e.family === 'win10' && e.sku === '101'
                    );
                    if (win10HomeIdx >= 0) onSelectEdition(win10HomeIdx);
                    showToast('Loaded Key', 'Windows 10 Home (TX9XD-...)');
                  }}
                  className="px-2 py-1 rounded-md bg-white dark:bg-[#28282d] border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-[#323238] text-neutral-800 dark:text-neutral-200 text-[11px] font-medium cursor-pointer transition-colors"
                >
                  Win 10 Home Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const k = 'W269N-WFGWX-YVC9B-4J6C9-T83GX';
                    onManualKeyChange(k);
                    const win11ProIdx = editions.findIndex(
                      (e) => e.family === 'win11' && e.sku === '48'
                    );
                    if (win11ProIdx >= 0) onSelectEdition(win11ProIdx);
                    showToast('Loaded Key', 'Windows 11 Pro (W269N-...)');
                  }}
                  className="px-2 py-1 rounded-md bg-white dark:bg-[#28282d] border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-[#323238] text-neutral-800 dark:text-neutral-200 text-[11px] font-medium cursor-pointer transition-colors"
                >
                  Win 11 Pro Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const k = 'D764K-2NDRG-44GXQ-QBP32-92629';
                    onManualKeyChange(k);
                    const serverIdx = editions.findIndex(
                      (e) => e.key === k
                    );
                    if (serverIdx >= 0) onSelectEdition(serverIdx);
                    showToast('Loaded Key', 'Windows Server 2025 Standard');
                  }}
                  className="px-2 py-1 rounded-md bg-white dark:bg-[#28282d] border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-[#323238] text-neutral-800 dark:text-neutral-200 text-[11px] font-medium cursor-pointer transition-colors"
                >
                  Server 2025 Key
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const fakeKey = 'BCDFG-HJKMN-PQRTV-WXY23-46789';
                    onManualKeyChange(fakeKey);
                    showToast('Loaded Random Key', 'Should be rejected as invalid');
                  }}
                  className="px-2 py-1 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-[11px] font-medium cursor-pointer transition-colors"
                >
                  Test Random / Fake Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. ADVANCED VIEW / COLLAPSIBLE DRAWER (Details, Utilities & Sync)         */}
        {/* ========================================================================= */}
        <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="w-full flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-0.5 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Advanced View & Diagnostics
            </span>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <span>{isAdvancedOpen ? 'Collapse' : 'Expand Details'}</span>
              {isAdvancedOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {isAdvancedOpen && (
            <div className="mt-2 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/80 space-y-2.5 text-xs animate-in fade-in duration-200">
              {/* Details Subsection */}
              {currentEdition ? (
                <div className="bg-neutral-50 dark:bg-[#1e1e22] rounded-lg p-2.5 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-200/60 dark:border-neutral-700/60">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Licensing Architecture Details</span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-xs rounded font-mono font-medium">
                        Channel: {currentEdition.method === 'hwid' ? 'Digital' : 'Volume'}
                      </span>
                      <span className="px-1.5 py-0.2 bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 text-xs rounded font-mono font-medium">
                        Branch: {currentEdition.displayOS.includes('LTSC') ? 'LTSC' : 'GA'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Family: </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{productFamily}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Channel: </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{releaseChannel}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Branch: </span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{servicingBranch}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 dark:text-neutral-400">Suffix: </span>
                      <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
                        ...{currentEdition.key.slice(-11)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-neutral-50 dark:bg-[#1e1e22] rounded-lg p-2.5 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                  No Windows edition currently selected. Use Auto-Detect or select an edition above.
                </div>
              )}

              {/* Action Utilities Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={handleCopySkuInfo}
                  className="py-1.5 px-2.5 bg-neutral-100 dark:bg-[#1e1e22] hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedKeyText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
                  <span>{copiedKeyText ? 'Copied!' : 'Copy SKU Info'}</span>
                </button>

                <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs font-semibold">
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    title="Export SKU database as CSV"
                    className="flex-1 py-1.5 px-1.5 bg-neutral-100 dark:bg-[#1e1e22] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1 transition-colors cursor-pointer border-r border-neutral-200 dark:border-neutral-700"
                  >
                    <FileSpreadsheet className="w-3 h-3 text-emerald-500" />
                    <span>CSV</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleExportJSON}
                    title="Export SKU database as JSON"
                    className="flex-1 py-1.5 px-1.5 bg-neutral-100 dark:bg-[#1e1e22] hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <FileCode className="w-3 h-3 text-blue-500" />
                    <span>JSON</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onOpenHotpatch}
                  className="py-1.5 px-2.5 bg-neutral-100 dark:bg-[#1e1e22] hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5 text-purple-500" />
                  <span className="truncate">Hotpatch</span>
                </button>

                {onToggleLogs && (
                  <button
                    type="button"
                    onClick={onToggleLogs}
                    className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      showLogs
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700'
                        : 'bg-neutral-100 dark:bg-[#1e1e22] hover:bg-neutral-200 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5 text-blue-500" />
                    <span>{showLogs ? 'Hide Console' : 'View Terminal'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. PROMINENT PRIMARY ACTION BUTTON (Activate / Convert / Install)         */}
      {/* ========================================================================= */}
      {activeTab !== 'iso' ? (
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <button
            onClick={activeTab === 'convert' ? onConvert : onActivate}
            disabled={
              isProcessing ||
              (activeTab !== 'manual' && !currentEdition) ||
              (activeTab === 'manual' && (!keyRecognition.isValid || !keyRecognition.isRecognized))
            }
            style={{ backgroundColor: 'var(--theme-accent, #2563eb)' }}
            className="flex-1 h-12 sm:h-13 hover:brightness-110 active:brightness-95 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg cursor-pointer transform active:scale-[0.99]"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>{t.Activating || 'Processing Activation Sequence...'}</span>
              </>
            ) : activeTab === 'convert' ? (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>
                  {t.Convert_versions} ({currentEdition ? currentEdition.displayOS : t.Select_target_SKU})
                </span>
              </>
            ) : activeTab === 'manual' ? (
              <>
                <Key className="w-4 h-4" />
                <span>
                  {keyRecognition.isValid && keyRecognition.isRecognized
                    ? `${t.Activate_Button} (${keyRecognition.matchedEdition?.displayOS || currentEdition?.displayOS || 'Windows'})`
                    : manualKey.length === 0
                    ? t.Input_target_SKU
                    : 'Invalid / Unrecognized Key'}
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>
                  {currentEdition
                    ? `${t.Activate_Button} (${currentEdition.displayOS})`
                    : `⚡ ${t.Select_target_SKU}`}
                </span>
              </>
            )}
          </button>

          {activeTab === 'convert' && (
            <>
              <button
                type="button"
                onClick={() => handleTabChange('iso')}
                className="h-12 sm:h-13 px-4 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
              >
                <Disc className="w-4 h-4" />
                <span>ISO Download Center</span>
              </button>

              <button
                type="button"
                onClick={onOpenUpgradeFull}
                disabled={isProcessing}
                className="h-12 sm:h-13 px-4 bg-neutral-100 dark:bg-[#252529] hover:bg-neutral-200 dark:hover:bg-neutral-700/80 text-neutral-700 dark:text-neutral-200 rounded-xl text-xs font-semibold border border-neutral-300/70 dark:border-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>ChangePK: Upgrade Full</span>
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-neutral-100/90 dark:bg-[#202026] rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs gap-2">
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>All ISO links point directly to official Microsoft Azure static CDN or verified SHA-256 MSDN archives.</span>
          </div>
          <button
            type="button"
            onClick={() => handleTabChange('auto')}
            className="w-full sm:w-auto px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Proceed to Activation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. STATUS BAR & NOTIFICATION TOAST                                        */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between text-xs px-1 text-neutral-500 dark:text-neutral-400 py-1">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            All Services OK
          </span>
          <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">•</span>
          <span className="hidden sm:inline font-mono text-[11px]">
            sppsvc.exe: Active (Port 1688)
          </span>
        </div>

        {toastMessage && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200 inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-xs font-semibold shadow-md">
            <Check className="w-3 h-3 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage.title}</span>
          </div>
        )}
      </div>
    </div>
  );
};
