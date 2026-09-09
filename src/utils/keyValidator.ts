import { SystemEditionItem } from '../types';
import { defaultEditions } from '../data/editions';

// Microsoft Base-24 character set allowed for Windows 5x5 product keys
// Specifically excludes 0, 1, 5, A, E, I, L, O, S, U, Z
export const MS_BASE24_CHARS = '2346789BCDFGHJKMNPQRTVWXY';
export const MS_BASE24_REGEX = /^[2346789BCDFGHJKMNPQRTVWXY]{25}$/;

export interface AdditionalKeyEntry {
  key: string;
  displayOS: string;
  family: string;
  sku: string;
  channel: string;
  method: 'hwid' | 'kms' | 'kms38' | 'oem_slic' | 'legacy_vl' | 'avma';
  editionIdMatch: number; // ID in defaultEditions to link to
  note?: string;
}

// Well-known genuine Microsoft Retail, OEM & Generic Default Product Keys (VK)
export const KNOWN_GENUINE_KEYS: AdditionalKeyEntry[] = [
  // Windows 11 / 10 Pro
  {
    key: 'VK7JG-NPHTM-C97JM-9MPGT-3V66T',
    displayOS: 'Windows 10 / 11 Pro',
    family: 'win10_11',
    sku: '48',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 1, // Windows 11 Pro / Windows 10 Pro
    note: 'Microsoft Official Retail / Digital License default installation key',
  },
  {
    key: 'W269N-WFGWX-YVC9B-4J6C9-T83GX',
    displayOS: 'Windows 10 / 11 Pro',
    family: 'win10_11',
    sku: '48',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 1,
    note: 'Microsoft Official KMS Client Setup Key (GVLK)',
  },
  // Windows 11 / 10 Home
  {
    key: 'YTMG3-N6DKC-DKB77-7M9GH-8HVX7',
    displayOS: 'Windows 10 / 11 Home',
    family: 'win10_11',
    sku: '101',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 44, // Windows 10 Home (or 3 for Windows 11 Home)
    note: 'Microsoft Official Retail / Digital License default installation key',
  },
  {
    key: 'TX9XD-98N7V-6WMQ6-BX7FG-H8Q99',
    displayOS: 'Windows 10 / 11 Home',
    family: 'win10_11',
    sku: '101',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 44, // Windows 10 Home
    note: 'Microsoft Official KMS Client Setup Key (GVLK)',
  },
  // Windows 11 / 10 Home Single Language
  {
    key: 'BT79Q-G7N6G-PGBYW-4YWX6-6F4BT',
    displayOS: 'Windows 10 / 11 Home Single Language',
    family: 'win10_11',
    sku: '100',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 46,
  },
  {
    key: '7HNRX-D7KGG-3K4RQ-4WPJ4-YTDFH',
    displayOS: 'Windows 10 / 11 Home Single Language',
    family: 'win10_11',
    sku: '100',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 46,
  },
  // Windows 11 / 10 Home N
  {
    key: '4CPRK-NM3K3-X6XXQ-RXX86-WXCHW',
    displayOS: 'Windows 10 / 11 Home N',
    family: 'win10_11',
    sku: '98',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 45,
  },
  {
    key: '3KHY7-WNT83-DGQKR-F7HPR-844BM',
    displayOS: 'Windows 10 / 11 Home N',
    family: 'win10_11',
    sku: '98',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 45,
  },
  // Windows 11 / 10 Pro N
  {
    key: '2B87N-8KFHP-DKV6R-Y2C8J-PKCKT',
    displayOS: 'Windows 10 / 11 Pro N',
    family: 'win10_11',
    sku: '49',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 2,
  },
  {
    key: 'MH37W-N47XK-V7XM9-C7227-GCQG9',
    displayOS: 'Windows 10 / 11 Pro N',
    family: 'win10_11',
    sku: '49',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 2,
  },
  // Windows 11 / 10 Pro for Workstations
  {
    key: 'DXG7C-N36C4-C4HTG-X4T3X-2YV77',
    displayOS: 'Windows 10 / 11 Pro for Workstations',
    family: 'win10_11',
    sku: '161',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 5,
  },
  {
    key: 'NRG8B-VKK3Q-CXVCJ-9G2XF-6Q84J',
    displayOS: 'Windows 10 / 11 Pro for Workstations',
    family: 'win10_11',
    sku: '161',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 5,
  },
  // Windows 11 / 10 Pro Education
  {
    key: '8PTT6-RNW4C-6V7J2-C2G3X-MHBPB',
    displayOS: 'Windows 10 / 11 Pro Education',
    family: 'win10_11',
    sku: '164',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 9,
  },
  {
    key: '6TP4R-GNPTD-KYYHQ-7B7DP-J4477',
    displayOS: 'Windows 10 / 11 Pro Education',
    family: 'win10_11',
    sku: '164',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 9,
  },
  // Windows 11 / 10 Education
  {
    key: 'YNMGQ-8RYV3-4PGQ3-C8XTP-7CFBY',
    displayOS: 'Windows 10 / 11 Education',
    family: 'win10_11',
    sku: '121',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 7,
  },
  {
    key: 'NW6C2-QMPVW-D7KKK-3GKT6-VCFB2',
    displayOS: 'Windows 10 / 11 Education',
    family: 'win10_11',
    sku: '121',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 7,
  },
  // Windows 11 / 10 Enterprise
  {
    key: 'XGVPP-NMH47-7TTHJ-W3FW7-8HV2C',
    displayOS: 'Windows 10 / 11 Enterprise',
    family: 'win10_11',
    sku: '4',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 11,
  },
  {
    key: 'NPPR9-FWDCX-D2C8J-H872K-2YT43',
    displayOS: 'Windows 10 / 11 Enterprise',
    family: 'win10_11',
    sku: '4',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 11,
  },
  // Windows 11 / 10 Enterprise LTSC 2024 / 2021
  {
    key: 'M7XTQ-FN8P6-TTKYV-9D4CC-J462D',
    displayOS: 'Windows 11 / 10 Enterprise LTSC 2024',
    family: 'ltsc',
    sku: '125',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 27, // Windows 11 Enterprise LTSC 2024
  },
  {
    key: '43TBQ-NH92J-XK8FB-RGQ83-C79TT',
    displayOS: 'Windows 10 Enterprise LTSC 2019',
    family: 'ltsc',
    sku: '125',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 30, // Windows 10 Enterprise LTSC 2019
  },
  // Windows 8.1
  {
    key: 'GCRJD-8NW9H-F2CDX-CCM8D-9D6T9',
    displayOS: 'Windows 8.1 Pro',
    family: 'win8',
    sku: '48',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 63,
  },
  {
    key: '334NH-RXG76-64THK-C7CKG-D3VPT',
    displayOS: 'Windows 8.1 Core / Home',
    family: 'win8',
    sku: '101',
    channel: 'Retail (Default Generic Key)',
    method: 'hwid',
    editionIdMatch: 66,
  },
  // Windows 7
  {
    key: 'RHTBY-VWY6D-QJRJ9-JGQ3X-Q2289',
    displayOS: 'Windows 7 Ultimate',
    family: 'win7',
    sku: '8',
    channel: 'Retail (Default Generic Key)',
    method: 'oem_slic',
    editionIdMatch: 87,
  },
  {
    key: 'FJ82H-XT6CR-J8D7P-XQJJ2-GPDD4',
    displayOS: 'Windows 7 Professional',
    family: 'win7',
    sku: '48',
    channel: 'Volume (GVLK / KMS)',
    method: 'kms',
    editionIdMatch: 88,
  },
  {
    key: 'HYFVD-28VHG-Q4C48-668CB-4WDDR',
    displayOS: 'Windows 7 Professional',
    family: 'win7',
    sku: '48',
    channel: 'Retail (Default Generic Key)',
    method: 'oem_slic',
    editionIdMatch: 88,
  },
  {
    key: 'VQB3X-Q3KP8-WJ2H8-R6B6D-7QJB7',
    displayOS: 'Windows 7 Home Premium',
    family: 'win7',
    sku: '3',
    channel: 'Retail (Default Generic Key)',
    method: 'oem_slic',
    editionIdMatch: 89,
  },
];

export interface KeyRecognitionResult {
  rawKey: string;
  formattedKey: string;
  isComplete: boolean;
  hasIllegalChars: boolean;
  illegalChars: string[];
  isValid: boolean;
  isRecognized: boolean;
  matchedEdition: SystemEditionItem | null;
  matchedEditionIndex: number;
  detectedOSVersion: string;
  detectedEditionName: string;
  detectedFamily: string;
  detectedChannel: string;
  detectedSKU: string;
  statusMessage: string;
  statusType: 'success' | 'warning' | 'error' | 'neutral';
  // If a key matches both Win 10 and Win 11 (like Home or Pro GVLK), options to choose
  alternativeEditions?: { edition: SystemEditionItem; index: number }[];
}

/**
 * Formats an incoming string into Microsoft 5x5 key syntax (XXXXX-XXXXX-XXXXX-XXXXX-XXXXX)
 */
export function formatProductKeyInput(input: string): string {
  const clean = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const capped = clean.slice(0, 25);
  const parts = capped.match(/.{1,5}/g) || [];
  return parts.join('-');
}

/**
 * Validates and recognizes which Windows version & edition a product key belongs to.
 * Ensures random fake keys are rejected and never falsely marked valid.
 */
export function validateAndRecognizeKey(
  inputKey: string,
  editionsList: SystemEditionItem[] = defaultEditions,
  preferredFamily?: string
): KeyRecognitionResult {
  const clean = inputKey.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const formatted = formatProductKeyInput(clean);
  const isComplete = clean.length === 25;

  // 1. Identify illegal characters
  const illegalChars: string[] = [];
  for (const char of clean) {
    if (!MS_BASE24_CHARS.includes(char) && !illegalChars.includes(char)) {
      illegalChars.push(char);
    }
  }
  const hasIllegalChars = illegalChars.length > 0;

  // Initial state for empty / incomplete
  if (clean.length === 0) {
    return {
      rawKey: clean,
      formattedKey: '',
      isComplete: false,
      hasIllegalChars: false,
      illegalChars: [],
      isValid: false,
      isRecognized: false,
      matchedEdition: null,
      matchedEditionIndex: -1,
      detectedOSVersion: '',
      detectedEditionName: '',
      detectedFamily: '',
      detectedChannel: '',
      detectedSKU: '',
      statusMessage: 'Enter a 25-character product key to detect Windows edition and validity.',
      statusType: 'neutral',
    };
  }

  if (hasIllegalChars) {
    return {
      rawKey: clean,
      formattedKey: formatted,
      isComplete,
      hasIllegalChars: true,
      illegalChars,
      isValid: false,
      isRecognized: false,
      matchedEdition: null,
      matchedEditionIndex: -1,
      detectedOSVersion: 'Invalid Product Key',
      detectedEditionName: 'Illegal Characters Detected',
      detectedFamily: '',
      detectedChannel: '',
      detectedSKU: '',
      statusMessage: `Key contains illegal characters: ${illegalChars.join(', ')}. Genuine Microsoft product keys never use 0, 1, 5, A, E, I, L, O, S, U, or Z.`,
      statusType: 'error',
    };
  }

  if (!isComplete) {
    return {
      rawKey: clean,
      formattedKey: formatted,
      isComplete: false,
      hasIllegalChars: false,
      illegalChars: [],
      isValid: false,
      isRecognized: false,
      matchedEdition: null,
      matchedEditionIndex: -1,
      detectedOSVersion: 'Incomplete Key',
      detectedEditionName: `${clean.length} / 25 characters`,
      detectedFamily: '',
      detectedChannel: '',
      detectedSKU: '',
      statusMessage: `Key has ${clean.length} of 25 characters (${25 - clean.length} more needed).`,
      statusType: 'warning',
    };
  }

  // 2. Lookup against editions database
  // Find all editions that match this key
  const matchingEditionsIndices: number[] = [];
  editionsList.forEach((ed, idx) => {
    const edClean = ed.key.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (edClean === clean) {
      matchingEditionsIndices.push(idx);
    }
  });

  // Also check additional known keys (Retail, OEM generic keys)
  const additionalMatch = KNOWN_GENUINE_KEYS.find(
    (k) => k.key.replace(/[^A-Za-z0-9]/g, '').toUpperCase() === clean
  );

  let matchedEdition: SystemEditionItem | null = null;
  let matchedEditionIndex = -1;
  let detectedChannel = '';
  let detectedOSVersion = '';
  let detectedEditionName = '';
  let detectedFamily = '';
  let detectedSKU = '';
  const alternatives: { edition: SystemEditionItem; index: number }[] = [];

  if (matchingEditionsIndices.length > 0) {
    // If multiple editions match (e.g. Windows 10 Home vs Windows 11 Home share TX9XD-...)
    // If the key is specifically for Home or Pro, let's see which matches
    const matchedEditions = matchingEditionsIndices.map((i) => ({
      edition: editionsList[i],
      index: i,
    }));

    // If preferred family matches, prioritize that (e.g., win10 or win11)
    let best = matchedEditions[0];
    if (preferredFamily) {
      const prefMatch = matchedEditions.find((m) => m.edition.family === preferredFamily);
      if (prefMatch) best = prefMatch;
    }

    matchedEdition = best.edition;
    matchedEditionIndex = best.index;

    // Collect alternatives if more than 1 edition matched
    if (matchedEditions.length > 1) {
      matchedEditions.forEach((m) => {
        alternatives.push(m);
      });
    }

    detectedChannel =
      matchedEdition.method === 'hwid'
        ? 'Digital License (Retail / HWID)'
        : matchedEdition.method === 'kms'
        ? 'Volume License (KMS GVLK)'
        : matchedEdition.method === 'kms38'
        ? 'Volume KMS38'
        : matchedEdition.method === 'oem_slic'
        ? 'OEM SLIC 2.1'
        : matchedEdition.method === 'avma'
        ? 'Hyper-V AVMA'
        : 'Volume License';

    detectedOSVersion = matchedEdition.displayOS.split(' ')[0] + ' ' + (matchedEdition.displayOS.split(' ')[1] || '');
    detectedEditionName = matchedEdition.displayOS;
    detectedFamily = matchedEdition.family;
    detectedSKU = matchedEdition.sku;
  } else if (additionalMatch) {
    // Linked to a known genuine retail/OEM key
    const targetEd = editionsList.find((e) => e.id === additionalMatch.editionIdMatch) || editionsList[0];
    const targetIdx = editionsList.indexOf(targetEd);

    matchedEdition = {
      ...targetEd,
      key: formatted,
      displayOS: additionalMatch.displayOS,
      method: additionalMatch.method,
    };
    matchedEditionIndex = targetIdx >= 0 ? targetIdx : 0;
    detectedChannel = additionalMatch.channel;
    detectedOSVersion = additionalMatch.displayOS;
    detectedEditionName = additionalMatch.displayOS;
    detectedFamily = additionalMatch.family;
    detectedSKU = additionalMatch.sku;
  }

  // 3. Evaluate Validity and Recognition
  if (matchedEdition) {
    return {
      rawKey: clean,
      formattedKey: formatted,
      isComplete: true,
      hasIllegalChars: false,
      illegalChars: [],
      isValid: true,
      isRecognized: true,
      matchedEdition,
      matchedEditionIndex,
      detectedOSVersion,
      detectedEditionName,
      detectedFamily,
      detectedChannel,
      detectedSKU,
      statusMessage: `Genuine Key Recognized: ${matchedEdition.displayOS} (SKU: ${detectedSKU} · ${detectedChannel}).`,
      statusType: 'success',
      alternativeEditions: alternatives.length > 1 ? alternatives : undefined,
    };
  }

  // 4. RANDOM / FAKE / UNRECOGNIZED KEY
  // The key has 25 Base-24 characters, BUT does not correspond to any genuine Microsoft product key!
  // It must NOT be treated as valid or activate Windows 11 Pro!
  return {
    rawKey: clean,
    formattedKey: formatted,
    isComplete: true,
    hasIllegalChars: false,
    illegalChars: [],
    isValid: false, // NOT valid because it is a random/counterfeit key!
    isRecognized: false,
    matchedEdition: null,
    matchedEditionIndex: -1,
    detectedOSVersion: 'Unrecognized Key',
    detectedEditionName: 'Invalid / Counterfeit Key',
    detectedFamily: 'unknown',
    detectedChannel: 'Unrecognized',
    detectedSKU: 'N/A',
    statusMessage:
      'Invalid Product Key: This key is not recognized as a genuine Microsoft Windows license. Activation engine rejected this key.',
    statusType: 'error',
  };
}
