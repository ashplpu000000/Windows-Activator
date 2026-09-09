import { SystemEditionItem, WindowsIsoItem } from '../types';
import { windowsIsoCatalog } from '../data/windowsIsos';

export interface MigrationPlan {
  isSameGeneration: boolean;
  canDirectConvert: boolean;
  needsIsoDownload: boolean;
  hostOS: string;
  targetOS: string;
  matchingIso: WindowsIsoItem | null;
  recommendedMethod: 'in_place_sku' | 'iso_upgrade' | 'iso_clean_downgrade';
  summary: string;
  stepByStep: string[];
  setupCommand?: string;
  dismCommand?: string;
  keyCommand?: string;
}

export function findMatchingIso(targetOS: string, family?: string): WindowsIsoItem | null {
  const norm = targetOS.toLowerCase();

  // 1. Direct family and keyword matching
  if (norm.includes('server 2025')) {
    return windowsIsoCatalog.find((i) => i.id === 'winserver-2025') || null;
  }
  if (norm.includes('server 2022')) {
    return windowsIsoCatalog.find((i) => i.id === 'winserver-2022') || null;
  }
  if (norm.includes('server 2019')) {
    return windowsIsoCatalog.find((i) => i.id === 'winserver-2019') || null;
  }
  if (norm.includes('server 2016')) {
    return windowsIsoCatalog.find((i) => i.id === 'winserver-2016') || null;
  }
  if (norm.includes('server 2012')) {
    return windowsIsoCatalog.find((i) => i.id === 'winserver-2012r2') || null;
  }
  if (norm.includes('server 2008')) {
    return windowsIsoCatalog.find((i) => i.id === 'winserver-2008r2') || null;
  }
  if (norm.includes('server 2003') || norm.includes('2005')) {
    return windowsIsoCatalog.find((i) => i.id === 'winserver-2003r2') || null;
  }

  // Windows 7
  if (norm.includes('win 7') || norm.includes('windows 7')) {
    if (norm.includes('ultimate')) {
      return windowsIsoCatalog.find((i) => i.id === 'win7-ultimate-sp1-x64') || null;
    }
    if (norm.includes('pro')) {
      return windowsIsoCatalog.find((i) => i.id === 'win7-pro-sp1-x64') || null;
    }
    if (norm.includes('thin')) {
      return windowsIsoCatalog.find((i) => i.id === 'win7-thin-pc') || null;
    }
    return windowsIsoCatalog.find((i) => i.id === 'win7-ultimate-sp1-x64') || null;
  }

  // Windows 8 / 8.1
  if (norm.includes('win 8') || norm.includes('windows 8')) {
    if (norm.includes('enterprise')) {
      return windowsIsoCatalog.find((i) => i.id === 'win81-enterprise') || null;
    }
    return windowsIsoCatalog.find((i) => i.id === 'win81-pro-x64') || null;
  }

  // Windows 11
  if (norm.includes('win 11') || norm.includes('windows 11')) {
    if (norm.includes('ltsc') || norm.includes('iot')) {
      return windowsIsoCatalog.find((i) => i.id === 'win11-ltsc-2024') || null;
    }
    if (norm.includes('arm')) {
      return windowsIsoCatalog.find((i) => i.id === 'win11-24h2-arm64') || null;
    }
    return windowsIsoCatalog.find((i) => i.id === 'win11-24h2-multi') || null;
  }

  // Windows 10
  if (norm.includes('win 10') || norm.includes('windows 10')) {
    if (norm.includes('ltsc 2021')) {
      return windowsIsoCatalog.find((i) => i.id === 'win10-ltsc-2021') || null;
    }
    if (norm.includes('ltsb 2016') || norm.includes('ltsb')) {
      return windowsIsoCatalog.find((i) => i.id === 'win10-ltsb-2016') || null;
    }
    if (norm.includes('32') || norm.includes('x86')) {
      return windowsIsoCatalog.find((i) => i.id === 'win10-22h2-x86') || null;
    }
    return windowsIsoCatalog.find((i) => i.id === 'win10-22h2-x64') || null;
  }

  // Fallback by family
  if (family) {
    const byFam = windowsIsoCatalog.find((i) => i.family === family);
    if (byFam) return byFam;
  }

  return windowsIsoCatalog[0];
}

export function buildMigrationPlan(
  hostOSName: string,
  targetEdition: SystemEditionItem,
): MigrationPlan {
  const host = hostOSName.toLowerCase();
  const target = targetEdition.displayOS.toLowerCase();
  const targetFamily = targetEdition.family;

  const isHostWin11 = host.includes('win 11') || host.includes('windows 11');
  const isHostWin10 = host.includes('win 10') || host.includes('windows 10');
  const isHostWin8 = host.includes('win 8') || host.includes('windows 8');
  const isHostWin7 = host.includes('win 7') || host.includes('windows 7');
  const isHostServer = host.includes('server');

  const isTargetWin11 = targetFamily === 'win11' || target.includes('win 11') || target.includes('windows 11');
  const isTargetWin10 = targetFamily === 'win10' || target.includes('win 10') || target.includes('windows 10');
  const isTargetWin8 = targetFamily === 'win8' || target.includes('win 8') || target.includes('windows 8');
  const isTargetWin7 = targetFamily === 'win7' || target.includes('win 7') || target.includes('windows 7');
  const isTargetServer = targetFamily === 'server' || target.includes('server');

  const matchingIso = findMatchingIso(targetEdition.displayOS, targetFamily);

  // Scenario 1: Same Generation In-Place Edition Switch
  // e.g. Win 11 Home -> Win 11 Pro, or Win 10 Home -> Win 10 Pro
  const isSameGeneration =
    (isHostWin11 && isTargetWin11) ||
    (isHostWin10 && isTargetWin10) ||
    (isHostWin8 && isTargetWin8) ||
    (isHostWin7 && isTargetWin7) ||
    (isHostServer && isTargetServer);

  if (isSameGeneration) {
    return {
      isSameGeneration: true,
      canDirectConvert: true,
      needsIsoDownload: false,
      hostOS: hostOSName,
      targetOS: targetEdition.displayOS,
      matchingIso,
      recommendedMethod: 'in_place_sku',
      summary: `Live In-Place Edition Conversion: Switch ${hostOSName} directly to ${targetEdition.displayOS} without formatting or reinstalling.`,
      stepByStep: [
        `1. Apply genuine default KMS/Retail SKU key for ${targetEdition.displayOS}`,
        `2. Execute live package switch via changepk.exe /ProductKey ${targetEdition.key}`,
        `3. Reboot system or activate immediately via Digital HWID / KMS`,
      ],
      setupCommand: `changepk.exe /ProductKey ${targetEdition.key}`,
      dismCommand: `dism /online /set-edition:${targetEdition.sku} /productkey:${targetEdition.key} /acceptEula`,
      keyCommand: `slmgr.vbs /ipk ${targetEdition.key}`,
    };
  }

  // Scenario 2: Upgrade to newer Windows (e.g. Win 10 -> Win 11, or Win 7/8 -> Win 10)
  const isUpgrade =
    (isHostWin10 && isTargetWin11) ||
    ((isHostWin7 || isHostWin8) && (isTargetWin10 || isTargetWin11));

  if (isUpgrade) {
    return {
      isSameGeneration: false,
      canDirectConvert: false,
      needsIsoDownload: true,
      hostOS: hostOSName,
      targetOS: targetEdition.displayOS,
      matchingIso,
      recommendedMethod: 'iso_upgrade',
      summary: `Cross-Generation Upgrade: Requires the ${matchingIso?.versionName || targetEdition.displayOS} ISO file to install while keeping your personal files & apps.`,
      stepByStep: [
        `1. Download the official ISO file: ${matchingIso?.versionName || targetEdition.displayOS} (${matchingIso?.fileSize || '5.4 GB'})`,
        `2. Double-click the ISO to mount it in Windows Explorer as a virtual drive`,
        `3. Run setup.exe to perform an in-place upgrade, keeping all your personal files, programs, and settings intact`,
        `4. Activate permanently using Windows Activator (HWID Digital License or KMS)`,
      ],
      setupCommand: `setup.exe /auto upgrade /dynamicupdate enable /pkey ${targetEdition.key}`,
      dismCommand: `dism /Apply-Image /ImageFile:sources\\install.wim /Index:1 /ApplyDir:C:\\`,
      keyCommand: `slmgr.vbs /ipk ${targetEdition.key}`,
    };
  }

  // Scenario 3: Downgrade or Cross-Architecture/Server Switch
  // e.g. Win 11 Pro -> Win 8 Pro, Win 7 Ultimate, or Win 11 -> Windows Server 2025
  return {
    isSameGeneration: false,
    canDirectConvert: false,
    needsIsoDownload: true,
    hostOS: hostOSName,
    targetOS: targetEdition.displayOS,
    matchingIso,
    recommendedMethod: 'iso_clean_downgrade',
    summary: `Cross-Version Migration / Downgrade: To switch from ${hostOSName} to ${targetEdition.displayOS}, you must download the official ISO file and create a bootable USB installer.`,
    stepByStep: [
      `1. Download the verified ISO file: ${matchingIso?.versionName || targetEdition.displayOS} (${matchingIso?.fileSize || '3.5 GB'})`,
      `2. Insert a USB flash drive (8GB+) and burn the ISO using Rufus or Ventoy`,
      `3. Back up personal files to an external drive or cloud storage`,
      `4. Boot machine from the USB flash drive and install ${targetEdition.displayOS}`,
      `5. Once booted, launch Windows Activator to activate ${targetEdition.displayOS} permanently!`,
    ],
    setupCommand: `setup.exe /auto clean /pkey ${targetEdition.key}`,
    dismCommand: `dism /Mount-Image /ImageFile:sources\\install.wim /Index:1 /MountDir:C:\\Mount`,
    keyCommand: `slmgr.vbs /ipk ${targetEdition.key}`,
  };
}
