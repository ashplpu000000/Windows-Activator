import { SystemEditionItem } from '../types';

export interface DetectedSystemInfo {
  isWindows: boolean;
  osFamily: 'win11' | 'win10' | 'win8' | 'win7' | 'vista' | 'winxp' | 'server' | 'ltsc' | 'other';
  osName: string; // e.g. "Windows 11", "Windows 10", "Windows XP", "Windows Server", etc.
  detectedEdition: string; // e.g. "Windows 11 Home", "Windows XP Professional", "Windows 10 Pro", etc.
  editionSku?: string; // e.g. "101", "48", "XP-PRO"
  isActivated: boolean; // license state: activated vs not activated
  estimatedBuild?: string; // e.g. "26100 (24H2)", "2600 (SP3)", "7601 (SP1)"
  kernelVersion: string; // e.g. "10.0", "5.1", "6.1"
  architecture: string; // "x64", "arm64", "x86"
  confidence: 'high' | 'medium' | 'low';
  detectionMethod: string;
  suggestedEditionIndex: number;
  candidateEditions: { index: number; edition: SystemEditionItem }[];
  rawDetails: string;
}

/**
 * Creates a fully detailed DetectedSystemInfo object from a specific SystemEditionItem.
 * Used whenever a user selects, switches, or converts an edition in the application.
 */
export function createDetectedInfoFromEdition(
  edition: SystemEditionItem,
  editions: SystemEditionItem[],
  isActivated: boolean = false,
  detectionMethod: string = 'Active System Profile'
): DetectedSystemInfo {
  const targetIdx = editions.indexOf(edition);

  // Normalize family to DetectedSystemInfo osFamily
  let osFamily: DetectedSystemInfo['osFamily'] = 'other';
  if (edition.family === 'winxp') {
    osFamily = 'winxp';
  } else if (edition.family === 'win11') {
    osFamily = 'win11';
  } else if (edition.family === 'win10') {
    osFamily = 'win10';
  } else if (edition.family === 'win10_11') {
    osFamily = edition.displayOS.includes('11') ? 'win11' : 'win10';
  } else if (edition.family === 'ltsc') {
    osFamily = 'ltsc';
  } else if (edition.family === 'server') {
    osFamily = 'server';
  } else if (edition.family === 'win8') {
    osFamily = 'win8';
  } else if (edition.family === 'win7') {
    osFamily = 'win7';
  } else if (edition.family === 'vista') {
    osFamily = 'vista';
  }

  // Derive human-readable OS Name
  let osName = 'Windows';
  if (edition.displayOS.includes('Windows 11')) osName = 'Windows 11';
  else if (edition.displayOS.includes('Windows 10')) osName = 'Windows 10';
  else if (edition.displayOS.includes('Windows 8.1')) osName = 'Windows 8.1';
  else if (edition.displayOS.includes('Windows 8')) osName = 'Windows 8';
  else if (edition.displayOS.includes('Windows 7')) osName = 'Windows 7';
  else if (edition.displayOS.includes('Windows Vista')) osName = 'Windows Vista';
  else if (edition.displayOS.includes('Windows XP') || edition.family === 'winxp') osName = 'Windows XP';
  else if (edition.displayOS.includes('Server') || edition.family === 'server') osName = 'Windows Server';

  // Kernel version derivation
  let kernelVersion = edition.ntKernel?.replace(/^NT\s*/i, '') || '';
  if (!kernelVersion) {
    if (osFamily === 'winxp') kernelVersion = '5.1';
    else if (osFamily === 'win7') kernelVersion = '6.1';
    else if (osFamily === 'win8') kernelVersion = edition.displayOS.includes('8.1') ? '6.3' : '6.2';
    else if (osFamily === 'vista') kernelVersion = '6.0';
    else kernelVersion = '10.0';
  }

  // Build number derivation
  let estimatedBuild = edition.buildNumber || '';
  if (!estimatedBuild) {
    if (osFamily === 'winxp') estimatedBuild = '2600 (SP3)';
    else if (osFamily === 'win7') estimatedBuild = '7601 (SP1)';
    else if (osFamily === 'win8') estimatedBuild = edition.displayOS.includes('8.1') ? '9600' : '9200';
    else if (osFamily === 'vista') estimatedBuild = '6003 (SP2)';
    else if (edition.displayOS.includes('2025')) estimatedBuild = '26100.2454 (Server 2025)';
    else if (edition.displayOS.includes('2024') || edition.displayOS.includes('24H2')) estimatedBuild = '26100 (24H2)';
    else if (edition.displayOS.includes('22631') || edition.displayOS.includes('23H2')) estimatedBuild = '22631 (23H2)';
    else if (edition.displayOS.includes('19045') || edition.displayOS.includes('22H2')) estimatedBuild = '19045 (22H2)';
    else estimatedBuild = '26100 (24H2)';
  }

  // Architecture derivation
  const architecture = edition.arch
    ? edition.arch.includes('x86') && !edition.arch.includes('x64')
      ? 'x86'
      : edition.arch.includes('arm64')
      ? 'arm64'
      : 'x64'
    : 'x64';

  // Candidate editions from matching family or category
  const candidateEditions = editions
    .map((ed, idx) => ({ index: idx, edition: ed }))
    .filter((item) => {
      if (edition.family === 'winxp') return item.edition.family === 'winxp';
      if (edition.family === 'ltsc') return item.edition.family === 'ltsc' || item.edition.category === 'ltsc';
      if (edition.family === 'server') return item.edition.family === 'server';
      if (edition.family === 'win7') return item.edition.family === 'win7';
      if (edition.family === 'win8') return item.edition.family === 'win8';
      if (edition.family === 'vista') return item.edition.family === 'vista';
      if (edition.family === 'win11') return item.edition.family === 'win11';
      if (edition.family === 'win10') return item.edition.family === 'win10';
      if (edition.family === 'win10_11') return item.edition.family === 'win10' || item.edition.family === 'win11' || item.edition.family === 'win10_11';
      return item.edition.family === edition.family;
    });

  return {
    isWindows: true,
    osFamily,
    osName,
    detectedEdition: edition.displayOS,
    editionSku: edition.sku,
    isActivated,
    estimatedBuild,
    kernelVersion,
    architecture,
    confidence: 'high',
    detectionMethod,
    suggestedEditionIndex: targetIdx >= 0 ? targetIdx : 0,
    candidateEditions,
    rawDetails: `${edition.displayOS} [SKU ${edition.sku}] · NT Kernel ${kernelVersion} · Build ${estimatedBuild} · Architecture: ${architecture}`,
  };
}

/**
 * Detects the host operating system, Windows version, kernel, and architecture
 * using modern User-Agent Client Hints (High Entropy) where available,
 * falling back to navigator.userAgent and active user profile selection.
 */
export async function detectHostOperatingSystem(
  editions: SystemEditionItem[],
  options?: {
    forceHardwareRescan?: boolean;
    preferredEditionName?: string;
  }
): Promise<DetectedSystemInfo> {
  let isWindows = false;
  let osFamily: DetectedSystemInfo['osFamily'] = 'other';
  let osName = 'Unknown OS';
  let estimatedBuild = '';
  let kernelVersion = 'Unknown';
  let architecture = 'x64';
  let confidence: DetectedSystemInfo['confidence'] = 'low';
  let detectionMethod = 'Browser Environment & User-Agent';
  let rawDetails = '';

  let explicitOverrideEdition = options?.preferredEditionName || '';
  let isActivated = false;
  try {
    const hasActivated = localStorage.getItem('win_activator_has_activated');
    const storedAct = localStorage.getItem('win_activator_is_activated');
    if (hasActivated === 'true' && storedAct === 'true') {
      isActivated = true;
    }
  } catch {
    // ignore
  }

  // Only if an explicit manual override was passed in options, use that edition
  if (explicitOverrideEdition) {
    const matchedSaved = editions.find(
      (e) =>
        e.displayOS.toLowerCase() === explicitOverrideEdition.toLowerCase() ||
        e.sku.toLowerCase() === explicitOverrideEdition.toLowerCase() ||
        e.displayOS.toLowerCase().includes(explicitOverrideEdition.toLowerCase())
    );
    if (matchedSaved) {
      return createDetectedInfoFromEdition(
        matchedSaved,
        editions,
        isActivated,
        'Simulated Host Edition Profile'
      );
    }
  }

  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const platform = typeof navigator !== 'undefined' ? (navigator as any).userAgentData?.platform || navigator.platform || '' : '';

  // 1. Try High Entropy User-Agent Client Hints (Chromium / Edge / Chrome on Windows)
  try {
    const uaData = (navigator as any)?.userAgentData;
    if (uaData) {
      if (uaData.platform === 'Windows') {
        isWindows = true;
      }

      if (typeof uaData.getHighEntropyValues === 'function') {
        const highEntropy = await uaData.getHighEntropyValues([
          'platform',
          'platformVersion',
          'architecture',
          'bitness',
          'model',
        ]);

        rawDetails = `UA-CH: platform=${highEntropy.platform}, platformVersion=${highEntropy.platformVersion}, arch=${highEntropy.architecture}, bitness=${highEntropy.bitness}`;

        if (highEntropy.platform === 'Windows') {
          isWindows = true;
          confidence = 'high';
          detectionMethod = 'User-Agent Client Hints (High Entropy)';

          // Microsoft Windows Version mapping in Chromium:
          // platformVersion major version:
          // >= 13 -> Windows 11 (13=21H2, 14=22H2, 15=23H2, 16+=24H2)
          // 1 to 12 -> Windows 10 (e.g. 10.0.0, 1.0.0)
          // 0.3.0 -> Windows 8.1
          // 0.2.0 -> Windows 8
          // 0.1.0 -> Windows 7
          const pVer = highEntropy.platformVersion || '';
          const major = parseInt(pVer.split('.')[0], 10);

          if (!isNaN(major)) {
            if (major >= 13) {
              osFamily = 'win11';
              osName = 'Windows 11';
              kernelVersion = '10.0';
              if (major >= 16) estimatedBuild = '26100 (24H2)';
              else if (major === 15) estimatedBuild = '22631 (23H2)';
              else if (major === 14) estimatedBuild = '22621 (22H2)';
              else estimatedBuild = '22000 (21H2)';
            } else if (major >= 1) {
              osFamily = 'win10';
              osName = 'Windows 10';
              kernelVersion = '10.0';
              estimatedBuild = '19045 (22H2)';
            } else if (pVer.startsWith('0.3')) {
              osFamily = 'win8';
              osName = 'Windows 8.1';
              kernelVersion = '6.3';
              estimatedBuild = '9600';
            } else if (pVer.startsWith('0.2')) {
              osFamily = 'win8';
              osName = 'Windows 8';
              kernelVersion = '6.2';
              estimatedBuild = '9200';
            } else if (pVer.startsWith('0.1')) {
              osFamily = 'win7';
              osName = 'Windows 7';
              kernelVersion = '6.1';
              estimatedBuild = '7601 (SP1)';
            }
          }

          if (highEntropy.architecture === 'arm' || highEntropy.architecture === 'arm64') {
            architecture = 'arm64';
          } else if (highEntropy.bitness === '64' || highEntropy.architecture === 'x86_64') {
            architecture = 'x64';
          } else if (highEntropy.bitness === '32') {
            architecture = 'x86';
          }
        }
      }
    }
  } catch {
    // Fall back to standard navigator detection
  }

  // 2. Fallback to User-Agent Parsing if not determined with high confidence
  if (confidence !== 'high') {
    if (/Windows/i.test(ua) || /Win/i.test(platform)) {
      isWindows = true;
      confidence = 'medium';
      detectionMethod = 'Browser User-Agent (Standard)';

      if (/Windows Server/i.test(ua)) {
        osFamily = 'server';
        osName = 'Windows Server';
        kernelVersion = '10.0';
        estimatedBuild = '26100 (Server 2025) / 20348 (Server 2022)';
      } else if (/Windows NT 10\.0/i.test(ua)) {
        osFamily = 'win10';
        osName = 'Windows 10 / 11';
        kernelVersion = '10.0';
        estimatedBuild = '19045 (Win 10) / 22631 (Win 11)';
      } else if (/Windows NT 6\.3/i.test(ua)) {
        osFamily = 'win8';
        osName = 'Windows 8.1';
        kernelVersion = '6.3';
        estimatedBuild = '9600';
      } else if (/Windows NT 6\.2/i.test(ua)) {
        osFamily = 'win8';
        osName = 'Windows 8';
        kernelVersion = '6.2';
        estimatedBuild = '9200';
      } else if (/Windows NT 6\.1/i.test(ua)) {
        osFamily = 'win7';
        osName = 'Windows 7';
        kernelVersion = '6.1';
        estimatedBuild = '7601 (SP1)';
      } else if (/Windows NT 6\.0/i.test(ua)) {
        osFamily = 'vista';
        osName = 'Windows Vista';
        kernelVersion = '6.0';
        estimatedBuild = '6003 (SP2)';
      } else if (/Windows NT 5\.2/i.test(ua)) {
        osFamily = 'winxp';
        osName = 'Windows XP x64 / Server 2003';
        kernelVersion = '5.2';
        estimatedBuild = '3790 (SP2)';
      } else if (/Windows NT 5\.1|Windows XP/i.test(ua)) {
        osFamily = 'winxp';
        osName = 'Windows XP';
        kernelVersion = '5.1';
        estimatedBuild = '2600 (SP3)';
      } else {
        osFamily = 'win10';
        osName = 'Windows Operating System';
        kernelVersion = '10.0';
      }

      if (/Win64|x64|WOW64|x86_64/i.test(ua)) {
        architecture = 'x64';
      } else if (/ARM64|AARCH64/i.test(ua)) {
        architecture = 'arm64';
      } else {
        architecture = 'x86';
      }
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
      isWindows = false;
      osFamily = 'other';
      osName = 'macOS';
      kernelVersion = 'Darwin';
      detectionMethod = 'Host Client UA';
    } else if (/Linux/i.test(ua)) {
      isWindows = false;
      osFamily = 'other';
      osName = 'Linux / Web Host';
      kernelVersion = 'Linux';
      detectionMethod = 'Host Client UA';
    } else if (/Android/i.test(ua)) {
      isWindows = false;
      osFamily = 'other';
      osName = 'Android';
      detectionMethod = 'Host Client UA';
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      isWindows = false;
      osFamily = 'other';
      osName = 'iOS';
      detectionMethod = 'Host Client UA';
    }
  }

  // 3. Find Candidate Editions in editions list
  let candidateEditions: { index: number; edition: SystemEditionItem }[] = [];
  let suggestedEditionIndex = -1;
  let detectedEdition = osName;
  let editionSku = '';

  if (explicitOverrideEdition) {
    const savedLower = explicitOverrideEdition.toLowerCase();
    if (savedLower.includes('server')) {
      osFamily = 'server';
      osName = 'Windows Server';
    } else if (savedLower.includes('ltsc') || savedLower.includes('ltsb')) {
      osFamily = 'ltsc';
      osName = 'Windows Enterprise LTSC';
    } else if (savedLower.includes('xp')) {
      osFamily = 'winxp';
      osName = 'Windows XP';
    }
  }

  if (isWindows) {
    if (osFamily === 'winxp') {
      candidateEditions = editions
        .map((ed, idx) => ({ index: idx, edition: ed }))
        .filter((item) => item.edition.family === 'winxp');

      const savedMatch = explicitOverrideEdition
        ? candidateEditions.find((c) => c.edition.displayOS.toLowerCase() === explicitOverrideEdition.toLowerCase())
        : null;

      if (savedMatch) {
        suggestedEditionIndex = savedMatch.index;
      } else {
        const proIdx = candidateEditions.find((c) => c.edition.displayOS.includes('Professional'));
        suggestedEditionIndex = proIdx ? proIdx.index : (candidateEditions[0]?.index ?? -1);
      }

      const picked = editions[suggestedEditionIndex];
      detectedEdition = picked ? picked.displayOS : 'Windows XP Professional SP3 (Volume License / VLK)';
      editionSku = picked ? picked.sku : 'XP-PRO';
    } else if (osFamily === 'win11') {
      candidateEditions = editions
        .map((ed, idx) => ({ index: idx, edition: ed }))
        .filter((item) => item.edition.family === 'win11');

      const savedMatch = explicitOverrideEdition
        ? candidateEditions.find((c) => c.edition.displayOS.toLowerCase() === explicitOverrideEdition.toLowerCase())
        : null;

      if (savedMatch) {
        suggestedEditionIndex = savedMatch.index;
      } else {
        const proIdx = candidateEditions.find((c) => c.edition.sku === '48');
        const homeIdx = candidateEditions.find((c) => c.edition.sku === '101' || c.edition.displayOS.includes('Home'));
        suggestedEditionIndex = proIdx ? proIdx.index : (homeIdx ? homeIdx.index : (candidateEditions[0]?.index ?? -1));
      }

      const picked = editions[suggestedEditionIndex];
      detectedEdition = picked ? picked.displayOS : 'Windows 11 Pro';
      editionSku = picked ? picked.sku : '48';
    } else if (osFamily === 'win10') {
      candidateEditions = editions
        .map((ed, idx) => ({ index: idx, edition: ed }))
        .filter((item) => item.edition.family === 'win10');

      const savedMatch = explicitOverrideEdition
        ? candidateEditions.find((c) => c.edition.displayOS.toLowerCase() === explicitOverrideEdition.toLowerCase())
        : null;

      if (savedMatch) {
        suggestedEditionIndex = savedMatch.index;
      } else {
        const proIdx = candidateEditions.find((c) => c.edition.sku === '48');
        const homeIdx = candidateEditions.find((c) => c.edition.sku === '101' || c.edition.displayOS.includes('Home'));
        suggestedEditionIndex = proIdx ? proIdx.index : (homeIdx ? homeIdx.index : (candidateEditions[0]?.index ?? -1));
      }

      const picked = editions[suggestedEditionIndex];
      detectedEdition = picked ? picked.displayOS : 'Windows 10 Pro';
      editionSku = picked ? picked.sku : '48';
    } else if (osFamily === 'server') {
      candidateEditions = editions
        .map((ed, idx) => ({ index: idx, edition: ed }))
        .filter((item) => item.edition.family === 'server');

      suggestedEditionIndex = candidateEditions[0]?.index ?? -1;
      const picked = editions[suggestedEditionIndex];
      detectedEdition = picked ? picked.displayOS : 'Windows Server 2025 Standard';
      editionSku = picked ? picked.sku : '7';
    } else if (osFamily === 'win8') {
      candidateEditions = editions
        .map((ed, idx) => ({ index: idx, edition: ed }))
        .filter((item) => item.edition.family === 'win8');
      suggestedEditionIndex = candidateEditions[0]?.index ?? -1;
      const picked = editions[suggestedEditionIndex];
      detectedEdition = picked ? picked.displayOS : 'Windows 8.1 Pro';
      editionSku = picked ? picked.sku : '';
    } else if (osFamily === 'win7') {
      candidateEditions = editions
        .map((ed, idx) => ({ index: idx, edition: ed }))
        .filter((item) => item.edition.family === 'win7');
      suggestedEditionIndex = candidateEditions[0]?.index ?? -1;
      const picked = editions[suggestedEditionIndex];
      detectedEdition = picked ? picked.displayOS : 'Windows 7 Ultimate';
      editionSku = picked ? picked.sku : '';
    } else if (osFamily === 'vista') {
      candidateEditions = editions
        .map((ed, idx) => ({ index: idx, edition: ed }))
        .filter((item) => item.edition.family === 'vista');
      suggestedEditionIndex = candidateEditions[0]?.index ?? -1;
      const picked = editions[suggestedEditionIndex];
      detectedEdition = picked ? picked.displayOS : 'Windows Vista Ultimate';
      editionSku = picked ? picked.sku : '';
    }
  }

  return {
    isWindows,
    osFamily,
    osName,
    detectedEdition,
    editionSku,
    isActivated,
    estimatedBuild,
    kernelVersion,
    architecture,
    confidence,
    detectionMethod,
    suggestedEditionIndex,
    candidateEditions,
    rawDetails: rawDetails || ua,
  };
}

