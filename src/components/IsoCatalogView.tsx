import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Copy,
  Check,
  ExternalLink,
  Info,
  Server,
  Monitor,
  HardDrive,
  Cpu,
  Hash,
} from 'lucide-react';
import { WindowsIsoItem } from '../types';
import { windowsIsoCatalog } from '../data/windowsIsos';

export type IsoCategoryFilter =
  | 'all'
  | 'win11'
  | 'win10'
  | 'win8'
  | 'win7'
  | 'server'
  | 'ltsc'
  | 'legacy';

interface IsoCatalogViewProps {
  initialSearch?: string;
  onSelectTargetOS?: (editionName: string) => void;
}

export const IsoCatalogView: React.FC<IsoCatalogViewProps> = ({
  initialSearch = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState<IsoCategoryFilter>('all');
  const [archFilter, setArchFilter] = useState<'all' | 'x64' | 'x86' | 'arm64'>('all');
  const [copiedUrlId, setCopiedUrlId] = useState<string | null>(null);
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);
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

  const handleCopyAllLinks = () => {
    const textList = filteredIsos
      .map(
        (iso) =>
          `• ${iso.versionName} (${iso.architecture}) [${iso.fileSize}]\n  Direct ISO: ${iso.directDownloadUrl}\n  Official Portal: ${iso.officialMirrorUrl}\n  SHA-256: ${iso.sha256}`
      )
      .join('\n\n');

    navigator.clipboard.writeText(textList);
    setCopiedAllLinks(true);
    setTimeout(() => setCopiedAllLinks(false), 2500);
  };

  const handleDownload = (item: WindowsIsoItem) => {
    setDownloadingId(item.id);
    window.open(item.directDownloadUrl, '_blank');
    setTimeout(() => setDownloadingId(null), 3500);
  };

  const categories: { key: IsoCategoryFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All Windows', count: windowsIsoCatalog.length },
    {
      key: 'win11',
      label: 'Windows 11',
      count: windowsIsoCatalog.filter((i) => i.family === 'win11').length,
    },
    {
      key: 'win10',
      label: 'Windows 10',
      count: windowsIsoCatalog.filter((i) => i.family === 'win10').length,
    },
    {
      key: 'server',
      label: 'Windows Server',
      count: windowsIsoCatalog.filter((i) => i.family === 'server').length,
    },
    {
      key: 'ltsc',
      label: 'Enterprise LTSC',
      count: windowsIsoCatalog.filter((i) => i.category === 'ltsc').length,
    },
    {
      key: 'win8',
      label: 'Windows 8.1 / 8',
      count: windowsIsoCatalog.filter((i) => i.family === 'win8').length,
    },
    {
      key: 'win7',
      label: 'Windows 7',
      count: windowsIsoCatalog.filter((i) => i.family === 'win7').length,
    },
    {
      key: 'legacy',
      label: 'Vista / XP',
      count: windowsIsoCatalog.filter((i) => i.category === 'legacy').length,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="p-3.5 bg-neutral-50 dark:bg-[#232329] border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Windows 11, 10, Server 2025, 8.1, 7, LTSC, build number..."
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-[#18181c] border border-neutral-200 dark:border-neutral-700/80 rounded-lg text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs px-1 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Architecture Filter & Copy All Action */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center bg-white dark:bg-[#18181c] p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-700/80 text-xs">
              {(['all', 'x64', 'x86', 'arm64'] as const).map((arch) => (
                <button
                  key={arch}
                  type="button"
                  onClick={() => setArchFilter(arch)}
                  className={`px-2 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                    archFilter === arch
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                  }`}
                >
                  {arch === 'all' ? 'All Arch' : arch}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyAllLinks}
              className="px-2.5 py-1.5 bg-white dark:bg-[#18181c] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700/80 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="Copy all filtered ISO links with hashes to clipboard"
            >
              {copiedAllLinks ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied All!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-blue-500" />
                  <span>Copy All Links ({filteredIsos.length})</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowUsbGuide(!showUsbGuide)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${
                showUsbGuide
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-[#18181c] text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/30'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>USB Flash Guide</span>
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-[#18181c] text-neutral-600 dark:text-neutral-400 border border-neutral-200/80 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-blue-700/80 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* USB Flash & Rufus Guide (Collapsible) */}
      {showUsbGuide && (
        <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-neutral-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-[#1e1e24] border border-blue-200 dark:border-blue-800 rounded-xl space-y-3 animate-in fade-in duration-200 text-xs text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-neutral-900 dark:text-neutral-100">
              <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>How to Create a Bootable Windows USB Drive</span>
            </div>
            <button
              type="button"
              onClick={() => setShowUsbGuide(false)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-white/80 dark:bg-[#18181c]/80 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mb-1">
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">1</span>
                <span>Download ISO File</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                Click any direct link below to download the genuine Windows ISO. Verify the SHA-256 hash against our catalog.
              </p>
            </div>

            <div className="p-3 bg-white/80 dark:bg-[#18181c]/80 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mb-1">
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">2</span>
                <span>Flash with Rufus or Ventoy</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                Insert an 8GB+ USB. In Rufus, select the ISO, set Partition scheme to <span className="font-mono text-blue-600 dark:text-blue-400">GPT</span> (for UEFI/Win 11) or <span className="font-mono text-blue-600 dark:text-blue-400">MBR</span> (for BIOS/Win 7), and click START.
              </p>
            </div>

            <div className="p-3 bg-white/80 dark:bg-[#18181c]/80 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5 mb-1">
                <span className="w-4 h-4 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">3</span>
                <span>Boot & Permanent Activation</span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                Reboot PC, press F12/F11 for Boot Menu, select your USB, and follow setup. After install, open Windows Activator to activate permanently!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ISO Cards List */}
      <div className="space-y-3">
        {filteredIsos.length === 0 ? (
          <div className="p-8 text-center bg-neutral-50 dark:bg-[#1e1e24] border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl space-y-2">
            <Info className="w-8 h-8 text-neutral-400 mx-auto" />
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              No ISO downloads matched &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-neutral-500">
              Try searching for &quot;Windows 11&quot;, &quot;24H2&quot;, &quot;Windows 10&quot;, &quot;Server 2025&quot;, &quot;7&quot;, or &quot;8.1&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setArchFilter('all');
              }}
              className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredIsos.map((item) => {
            const isDownloading = downloadingId === item.id;
            const isUrlCopied = copiedUrlId === item.id;
            const isHashCopied = copiedHashId === item.id;

            return (
              <div
                key={item.id}
                id={`iso-${item.id}`}
                className="p-4 bg-white dark:bg-[#1e1e24] border border-neutral-200 dark:border-neutral-800 hover:border-blue-400/80 dark:hover:border-blue-700/80 rounded-xl transition-all shadow-2xs space-y-3 group"
              >
                {/* Header: Title, Category Badge, Specs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        {item.family === 'server' ? (
                          <Server className="w-4 h-4 text-purple-500 shrink-0" />
                        ) : (
                          <Monitor className="w-4 h-4 text-blue-500 shrink-0" />
                        )}
                        <span>{item.versionName}</span>
                      </h3>

                      {/* Architecture Badge */}
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                        {item.architecture}
                      </span>

                      {/* Family / Category Badge */}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          item.family === 'server'
                            ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                            : item.category === 'ltsc'
                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                            : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                        }`}
                      >
                        {item.family === 'server' ? 'Server OS' : item.category === 'ltsc' ? 'LTSC Enterprise' : 'Consumer'}
                      </span>

                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        • {item.fileSize}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* Right: Quick Specs */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-[11px] text-neutral-500 dark:text-neutral-400 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 dark:border-neutral-800">
                    <span className="flex items-center gap-1 font-mono">
                      <Cpu className="w-3 h-3 text-neutral-400" />
                      Build {item.build}
                    </span>
                    <span className="text-neutral-400">Kernel: NT {item.ntKernel}</span>
                  </div>
                </div>

                {/* Technical Meta & In-Place Compatibility */}
                <div className="px-3 py-2 bg-neutral-50 dark:bg-[#18181c] rounded-lg border border-neutral-200/80 dark:border-neutral-800 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap text-neutral-600 dark:text-neutral-400">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">Editions included:</span>
                    <span className="bg-white dark:bg-[#25252b] px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-700 text-[11px]">
                      {item.edition}
                    </span>
                    {item.languages && item.languages.length > 0 && (
                      <span className="text-[11px] text-neutral-500">
                        ({item.languages[0]})
                      </span>
                    )}
                  </div>

                  {item.migrationNotes && (
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
                      <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{item.migrationNotes}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons: Direct Download, Copy Link, Official Mirror, SHA-256 */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                  {/* SHA-256 Hash Display */}
                  {item.sha256 ? (
                    <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-xs truncate max-w-md">
                      <Hash className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
                      <span className="text-[10px] font-mono truncate text-neutral-600 dark:text-neutral-400 select-all" title={item.sha256}>
                        SHA256: {item.sha256.substring(0, 20)}...
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.sha256!, 'hash', item.id)}
                        className="p-1 text-neutral-400 hover:text-blue-500 transition-colors cursor-pointer shrink-0"
                        title="Copy full authentic SHA-256 Hash"
                      >
                        {isHashCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}

                  {/* Download CTAs */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* Copy Direct URL */}
                    <button
                      type="button"
                      onClick={() => handleCopy(item.directDownloadUrl, 'url', item.id)}
                      className="px-2.5 py-1.5 bg-neutral-100 dark:bg-[#25252b] hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Copy direct ISO download link to clipboard"
                    >
                      {isUrlCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    {/* Official Mirror / Microsoft Portal Link */}
                    <a
                      href={item.officialMirrorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-neutral-100 dark:bg-[#25252b] hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Open Microsoft Software Download or Evaluation Center Portal"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Official Portal</span>
                    </a>

                    {/* Direct Download Button */}
                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      title="Initiate direct browser download from Microsoft/Official Server"
                    >
                      <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                      <span>{isDownloading ? 'Starting Download...' : 'Download ISO'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
