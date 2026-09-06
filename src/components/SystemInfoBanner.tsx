import React from 'react';
import { Laptop, CheckCircle2, ShieldAlert, Terminal } from 'lucide-react';
import { SystemEditionItem } from '../types';

interface SystemInfoBannerProps {
  currentEdition: SystemEditionItem;
  isActivated: boolean;
  hotpatchEnabled: boolean;
  onOpenStatus?: () => void;
}

export const SystemInfoBanner: React.FC<SystemInfoBannerProps> = ({
  currentEdition,
  isActivated,
  hotpatchEnabled,
  onOpenStatus,
}) => {
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

  const getActivationLabel = (item: SystemEditionItem) => {
    switch (item.method) {
      case 'hwid':
        return 'Activated (HWID Digital)';
      case 'kms38':
        return 'Activated (KMS38 Exp: 2038)';
      case 'kms':
        return 'Activated (KMS 180-day)';
      case 'oem_slic':
        return 'Activated (OEM SLIC 2.1)';
      case 'legacy_vl':
        return 'Activated (Volume PID)';
      case 'avma':
        return 'Activated (Hyper-V AVMA)';
      default:
        return 'Activated';
    }
  };

  return (
    <div className="w-full max-w-[540px] mx-auto mt-3 px-3 py-2 bg-neutral-100/70 dark:bg-neutral-800/40 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
      <div className="flex items-center space-x-2 truncate">
        <Laptop className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
        <span
          title={getBuildString(currentEdition)}
          className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[190px] sm:max-w-[270px]"
        >
          {currentEdition.displayOS} ({getBuildString(currentEdition)})
        </span>
        {currentEdition.ntKernel && (
          <span className="hidden md:inline-block px-1.5 py-0.2 bg-neutral-200/70 dark:bg-neutral-700/70 rounded text-[9.5px] font-mono font-medium text-neutral-700 dark:text-neutral-300">
            {currentEdition.ntKernel}
          </span>
        )}
        {currentEdition.arch && (
          <span className="inline-block px-1.5 py-0.2 bg-neutral-200/70 dark:bg-neutral-700/70 rounded text-[9.5px] font-mono font-medium text-neutral-700 dark:text-neutral-300">
            {currentEdition.arch}
          </span>
        )}
      </div>
      <div className="flex items-center space-x-2 shrink-0">
        <div className="flex items-center space-x-1">
          {isActivated ? (
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium text-[10.5px]">
              <CheckCircle2 className="w-3 h-3 mr-1 shrink-0" />
              {getActivationLabel(currentEdition)}
            </span>
          ) : (
            <span className="inline-flex items-center text-amber-600 dark:text-amber-400 font-medium text-[10.5px]">
              <ShieldAlert className="w-3 h-3 mr-1 shrink-0" />
              Notification State
            </span>
          )}
        </div>
        {hotpatchEnabled && (
          <span className="hidden sm:inline-block px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-semibold">
            Hotpatch
          </span>
        )}
        {onOpenStatus && (
          <button
            type="button"
            onClick={onOpenStatus}
            title="slmgr.vbs /dli"
            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

