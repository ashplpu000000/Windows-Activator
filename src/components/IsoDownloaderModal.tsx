import React, { useState, useMemo } from 'react';
import {
  Download,
  Search,
  ExternalLink,
  Copy,
  Check,
  Disc,
  X,
  HardDrive,
  Shield,
  Layers,
  Sparkles,
  Info,
  Server,
  Monitor,
  Flame,
} from 'lucide-react';
import { WindowsIsoItem } from '../types';
import { windowsIsoCatalog } from '../data/windowsIsos';

interface IsoDownloaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTargetOS?: string;
}

type IsoCategoryFilter =
  | 'all'
  | 'win11'
  | 'win10'
  | 'win8'
  | 'win7'
  | 'server'
  | 'ltsc'
  | 'legacy';

export const IsoDownloaderModal: React.FC<IsoDownloaderModalProps> = ({
  isOpen,
  onClose,
  selectedTargetOS,
}) => {
  const [searchQuery, setSearchQuery] = useState(selectedTargetOS || '');
  const [activeCategory, setActiveCategory] = useState<IsoCategoryFilter>('all');
  const [archFilter, setArchFilter] = useState<'all' | 'x64' | 'x86' | 'arm64'>('all');
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showUsbGuide, setShowUsbGuide] = useState(false);

  // Filtered ISO items
  const filteredIsos = useMemo(() => {
    return windowsIsoCatalog.filter((item) => {
      // Category filter
      if (activeCategory !== 'all') {
        if (activeCategory === 'win11' && item.family !== 'win11') return false;
        if (activeCategory === 'win10' && item.family !== 'win10') return false;
        if (activeCategory === 'win8' && item.family !== 'win8') return false;
        if (activeCategory === 'win7' && item.family !== 'win7') return false;
        if (activeCategory === 'server' && item.family !== 'server') return false;
        if (activeCategory === 'ltsc' && item.category !== 'ltsc') return false;
        if (activeCategory === 'legacy' && item.category !== 'legacy') return false;
      }

      // Architecture filter
      if (archFilter !== 'all') {
        if (!item.architecture.toLowerCase().includes(archFilter)) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.versionName.toLowerCase().includes(q);
        const matchesEdition = item.edition.toLowerCase().includes(q);
        const matchesBuild = item.build.toLowerCase().includes(q);
        const matchesYear = item.releaseYear.includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesEdition || matchesBuild || matchesYear || matchesDesc;
      }

      return true;
    });
  }, [activeCategory, archFilter, searchQuery]);

  const handleCopy = (text: string, type: 'url' | 'hash', id: string) => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrlId(id);
      setTimeout(() => setCopiedUrlId(null), 2000);
    } else {
      setCopiedHashId(id);
      setTimeout(() => setCopiedHashId(null), 2000);
    }
  };

  const handleDownload = (item: WindowsIsoItem) => {
    setDownloadingId(item.id);
    // Open in a new tab / trigger browser download
    window.open(item.directDownloadUrl, '_blank');
    setTimeout(() => setDownloadingId(null), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e1e24] text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700/80 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/80 dark:bg-[#25252b]/90 backdrop-blur-sm shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl">
              <Disc className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Windows ISO Download Center
                </h2>
                <span className="text-[11px] font-semibold uppercase px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-md">
                  All Versions & Servers
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Official Microsoft, Evaluation Center, & Verified Archive ISO direct download links
                with authentic SHA-256 hashes
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowUsbGuide(!showUsbGuide)}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-500" />
              <span>{showUsbGuide ? 'Hide USB Guide' : 'Bootable USB Guide'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bootable USB Quick Guide Banner */}
        {showUsbGuide && (
          <div className="px-5 py-3.5 bg-blue-50/90 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-900/60 text-xs text-neutral-700 dark:text-neutral-300 shrink-0">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  How to Change Installed Windows Version via Bootable USB (e.g. Win 11 to Win 8 / Win 7 / Server):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-[11px]">
                  <div className="p-2 bg-white dark:bg-neutral-900/80 rounded-lg border border-blue-100 dark:border-neutral-800">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Step 1: Download ISO</span>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Click direct download on your target version below (Win 11, 10, 8.1, 7, or Server 2003-2025).
                    </p>
                  </div>
                  <div className="p-2 bg-white dark:bg-neutral-900/80 rounded-lg border border-blue-100 dark:border-neutral-800">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Step 2: Create USB</span>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Use <a href="https://rufus.ie" target="_blank" rel="noreferrer" className="underline font-semibold text-blue-600">Rufus</a> (GPT for UEFI, MBR for legacy BIOS) or <a href="https://ventoy.net" target="_blank" rel="noreferrer" className="underline font-semibold text-blue-600">Ventoy</a>.
                    </p>
                  </div>
                  <div className="p-2 bg-white dark:bg-neutral-900/80 rounded-lg border border-blue-100 dark:border-neutral-800">
                    <span className="font-bold text-blue-600 dark:text-blue-400">Step 3: Boot & Activate</span>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                      Boot from USB, install Windows, then open Windows Activator to activate permanently!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-neutral-50/50 dark:bg-[#1b1b20] shrink-0">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Windows 11, 10, 8.1, 7, Server 2025, 2022, 2019, builds, ISOs..."
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-[#282830] rounded-xl text-xs border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-neutral-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Architecture Filter */}
          <div className="flex items-center space-x-1 self-start md:self-auto">
            <span className="text-xs text-neutral-500 font-medium mr-1.5">Arch:</span>
            {(['all', 'x64', 'x86', 'arm64'] as const).map((arch) => (
              <button
                key={arch}
                type="button"
                onClick={() => setArchFilter(arch)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase transition-colors cursor-pointer ${
                  archFilter === arch
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-neutral-200/70 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                }`}
              >
                {arch === 'all' ? 'All' : arch}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-5 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center space-x-1.5 overflow-x-auto no-scrollbar bg-neutral-100/60 dark:bg-[#202026] shrink-0 text-xs font-medium">
          {[
            { id: 'all', label: 'All Editions', count: windowsIsoCatalog.length, icon: Layers },
            {
              id: 'win11',
              label: 'Windows 11',
              count: windowsIsoCatalog.filter((i) => i.family === 'win11').length,
              icon: Monitor,
            },
            {
              id: 'win10',
              label: 'Windows 10',
              count: windowsIsoCatalog.filter((i) => i.family === 'win10').length,
              icon: Monitor,
            },
            {
              id: 'win8',
              label: 'Windows 8.1 / 8',
              count: windowsIsoCatalog.filter((i) => i.family === 'win8').length,
              icon: Monitor,
            },
            {
              id: 'win7',
              label: 'Windows 7',
              count: windowsIsoCatalog.filter((i) => i.family === 'win7').length,
              icon: Monitor,
            },
            {
              id: 'server',
              label: 'Windows Server (2003-2025)',
              count: windowsIsoCatalog.filter((i) => i.family === 'server').length,
              icon: Server,
            },
            {
              id: 'ltsc',
              label: 'LTSC & IoT',
              count: windowsIsoCatalog.filter((i) => i.category === 'ltsc').length,
              icon: Flame,
            },
            {
              id: 'legacy',
              label: 'Legacy (XP / Vista)',
              count: windowsIsoCatalog.filter((i) => i.category === 'legacy').length,
              icon: HardDrive,
            },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id as IsoCategoryFilter)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/70 dark:hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-blue-800/60 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ISO List Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {filteredIsos.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Disc className="w-12 h-12 mx-auto mb-2 opacity-30 animate-pulse" />
              <p className="text-sm font-semibold">No Windows ISOs found</p>
              <p className="text-xs mt-1">Try broadening your search query or selecting a different category.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setArchFilter('all');
                }}
                className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredIsos.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-neutral-50/90 dark:bg-[#25252c] rounded-xl border border-neutral-200/80 dark:border-neutral-700/60 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-2xs hover:shadow-xs group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Info Header */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.versionName}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold bg-neutral-200/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {item.architecture}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300">
                        {item.fileSize}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-100/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                        {item.releaseYear}
                      </span>
                      {item.category === 'server' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300">
                          Server Edition
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                      <span>
                        <strong className="text-neutral-700 dark:text-neutral-300">Editions:</strong> {item.edition}
                      </span>
                      <span>
                        <strong className="text-neutral-700 dark:text-neutral-300">Build:</strong> {item.build}
                      </span>
                      <span>
                        <strong className="text-neutral-700 dark:text-neutral-300">Kernel:</strong> NT {item.ntKernel}
                      </span>
                      <span>
                        <strong className="text-neutral-700 dark:text-neutral-300">Languages:</strong> {item.languages.join(', ')}
                      </span>
                    </div>

                    {/* SHA-256 Hash Display */}
                    {item.sha256 && (
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                          SHA-256:
                        </span>
                        <code className="text-[10px] font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-200/50 dark:bg-neutral-800/60 px-1.5 py-0.5 rounded truncate max-w-[280px] sm:max-w-md select-all">
                          {item.sha256}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.sha256!, 'hash', item.id)}
                          title="Copy SHA-256 Hash"
                          className="p-1 hover:text-blue-600 dark:hover:text-blue-400 text-neutral-400 transition-colors cursor-pointer"
                        >
                          {copiedHashId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {/* Migration Note */}
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2.5 py-1 rounded-lg border border-amber-200/60 dark:border-amber-900/40 mt-1">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.migrationNotes}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-row lg:flex-col items-center lg:items-end justify-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-neutral-200 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      disabled={downloadingId === item.id}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs hover:shadow-xs transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span>{downloadingId === item.id ? 'Opening Download...' : `Download ISO (${item.fileSize})`}</span>
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.directDownloadUrl, 'url', item.id)}
                        title="Copy direct download link"
                        className="px-2.5 py-1.5 bg-neutral-200/70 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedUrlId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-neutral-500" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      {item.officialMirrorUrl && (
                        <a
                          href={item.officialMirrorUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Official Microsoft Evaluation / TechBench Mirror"
                          className="p-1.5 bg-neutral-200/70 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {item.torrentMagnet && (
                        <a
                          href={item.torrentMagnet}
                          title="Download via Magnet / Torrent"
                          className="px-2 py-1.5 bg-neutral-200/70 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-purple-600 dark:text-purple-400 rounded-lg text-[11px] font-bold font-mono transition-colors cursor-pointer"
                        >
                          Magnet
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#25252b] flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 shrink-0">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>All ISO links point directly to official Microsoft Azure CDNs & verified web archives.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
