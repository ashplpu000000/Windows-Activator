import React from 'react';
import { Laptop, CheckCircle2, ShieldAlert, Terminal, Sparkles } from 'lucide-react';
import { SystemEditionItem, LanguageCode } from '../types';
import { translations } from '../translations';

interface SystemInfoBannerProps {
  currentEdition: SystemEditionItem | null;
  isActivated: boolean;
  hotpatchEnabled: boolean;
  onOpenStatus?: () => void;
  onAutoDetect?: () => void;
  detectedOS?: string;
  language?: LanguageCode;
}

export const SystemInfoBanner: React.FC<SystemInfoBannerProps> = ({
  currentEdition,
  isActivated,
  hotpatchEnabled,
  onOpenStatus,
  onAutoDetect,
  detectedOS,
  language = 'en',
}) => {
  const t = translations[language] || translations.en;
  // Compute realistic build strings based on edition family & year
  const getBuildString = (item: SystemEditionItem) => {
    if (item.buildNumber) return `Build ${item.buildNumber}`;
    if (item.displayOS.includes('2025')) return 'Build 26100.2454 (Server 2025)';
    if (item.displayOS.includes('2024')) return 'Build 26100.1742 (24H2)';
    if (item.displayOS.includes('2022')) return 'Build 20348.2762 (Server 2022)';
    if (item.displayOS.includes('2021')) return 'Build 19044.1288 (21H2)';
    if (item.displayOS.includes('2019')) return 'Build 17763.6414 (RS5)';
    if (item.displayOS.includes('2016')) return 'Build 14393.7428 (RS1)';
    if (item.displayOS.includes('2015')) return 'Build 10240.16384 (TH1)';
    if (item.displayOS.includes('2012 R2')) return 'Build 9600.22058';
    if (item.displayOS.includes('2012')) return 'Build 9200.24071';
    if (item.displayOS.includes('2008 R2')) return 'Build 7601.24544 (SP1)';
    if (item.displayOS.includes('2008')) return 'Build 6003.20862 (SP2)';
    if (item.displayOS.includes('2005') || item.displayOS.includes('2003')) return 'Build 3790.3959 (SP2)';
    if (item.family === 'win8') return 'Build 9600.20773 (Windows 8.1)';
    if (item.family === 'win7') return 'Build 7601.24544 (Service Pack 1)';
    return 'Build 26100.1742 (Windows 11 24H2)';
  };

  const hostName = detectedOS || 'Windows Host PC';

  return (
    <div className="w-full mt-1 sm:mt-1.5 px-3.5 sm:px-4 py-2 bg-neutral-100/90 dark:bg-[#202024]/90 rounded-xl border border-neutral-200/80 dark:border-neutral-800/80 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-400 shadow-2xs">
      {/* Left side: Host System and Target SKU info */}
      <div className="flex items-center space-x-2 truncate min-w-0">
        <Laptop className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
          Host: {hostName}
        </span>
        {currentEdition && (
          <>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span
              title={`Target Activation SKU: ${currentEdition.displayOS} (${getBuildString(currentEdition)})`}
              className="text-neutral-600 dark:text-neutral-300 truncate font-medium"
            >
              Target: <span className="font-semibold text-neutral-900 dark:text-neutral-100">{currentEdition.displayOS}</span>
            </span>
          </>
        )}
      </div>

      {/* Right side: Host Activation Status & Tools */}
      <div className="flex items-center space-x-2.5 shrink-0">
        <div className="flex items-center space-x-1.5">
          {isActivated ? (
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 shrink-0" />
              <span>Host Activated</span>
            </span>
          ) : (
            <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold text-xs">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 shrink-0" />
              <span>Host Not Activated</span>
            </span>
          )}
        </div>

        {hotpatchEnabled && (
          <span className="hidden sm:inline-block px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-md text-[11px] font-semibold">
            Hotpatch
          </span>
        )}

        {onAutoDetect && (
          <button
            type="button"
            onClick={onAutoDetect}
            title="Scan host machine OS"
            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden sm:inline">{t.Auto_Mode}</span>
          </button>
        )}

        {onOpenStatus && (
          <button
            type="button"
            onClick={onOpenStatus}
            title="slmgr.vbs /dli"
            className="p-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            <Terminal className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

