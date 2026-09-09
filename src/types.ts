export type LanguageCode =
  | 'en'
  | 'zh'
  | 'zh-TW'
  | 'es'
  | 'fr'
  | 'de'
  | 'ru'
  | 'ja'
  | 'pt'
  | 'it'
  | 'ko'
  | 'hi'
  | 'bn'
  | 'ar'
  | 'tr'
  | 'vi'
  | 'pl'
  | 'uk'
  | 'nl'
  | 'id'
  | 'th'
  | 'el'
  | 'cs'
  | 'sv'
  | 'ro'
  | 'hu'
  | 'da'
  | 'fi'
  | 'no'
  | 'he'
  | 'fa'
  | 'ur'
  | 'ms'
  | 'tl'
  | 'sw'
  | 'ta'
  | 'te'
  | 'mr'
  | 'sr'
  | 'hr'
  | 'sk'
  | 'bg'
  | 'ca'
  | 'lt'
  | 'sl'
  | 'lv'
  | 'et'
  | 'af'
  | 'eu'
  | 'gl'
  | (string & {});

export type ThemeMode = 'system' | 'dark' | 'light';

export interface ThemePreset {
  id: string;
  name: string;
  category: string;
  mode: 'light' | 'dark';
  bgGradient: string;
  windowBg: string;
  headerBg: string;
  accentColor: string;
  accentHover: string;
  textColor: string;
  secondaryText: string;
  borderCol: string;
  cardBg: string;
  previewColor: string;
}

export interface LicenseTaskOptions {
  isAuto: boolean;
  systemEdition: string;
  manualKey: string;
}

export interface LicenseTaskResult {
  code: string;
  systemMessage?: string;
  willActivateLater?: boolean;
  succeeded: boolean;
}

export type Architecture = 'x64' | 'x86' | 'x64 / x86' | 'arm64' | 'x64 / arm64' | 'x64 / x86 / arm64' | 'ia64';

export type OSFamily =
  | 'all'
  | 'win11'
  | 'win10'
  | 'win10_11'
  | 'ltsc'
  | 'eval'
  | 'iot'
  | 'server'
  | 'win8'
  | 'win7'
  | 'vista'
  | 'winxp'
  | 'preview';

export type ActivationMethod =
  | 'hwid'
  | 'kms38'
  | 'kms'
  | 'oem_slic'
  | 'legacy_vl'
  | 'avma'
  | 'wpa_offline'
  | 'phone_cid';

export interface SystemEditionItem {
  id: number;
  displayOS: string;
  key: string;
  sku: string;
  family: OSFamily;
  method: ActivationMethod;
  arch?: Architecture;
  releaseYear?: string;
  category?: 'standard' | 'offline_kms' | 'experimental' | 'ltsc' | 'server' | 'legacy' | 'iot' | 'eval' | 'preview';
  ntKernel?: string;
  buildNumber?: string;
}

export type ActiveDialog =
  | null
  | 'wait'
  | 'act_prog'
  | 'complete'
  | 'complete_donate'
  | 'error'
  | 'upgrade_full'
  | 'rebootless_update'
  | 'help'
  | 'update'
  | 'slmgr_status'
  | 'theme_picker'
  | 'key_checker'
  | 'iso_downloader'
  | 'xp_activation_tool';

export interface WindowsIsoItem {
  id: string;
  versionName: string;
  edition: string;
  family: OSFamily | 'legacy';
  releaseYear: string;
  build: string;
  architecture: Architecture;
  fileSize: string;
  sha256?: string;
  languages: string[];
  directDownloadUrl: string;
  officialMirrorUrl?: string;
  torrentMagnet?: string;
  category: 'consumer' | 'enterprise' | 'ltsc' | 'server' | 'legacy';
  description: string;
  ntKernel: string;
  migrationNotes: string;
  canInPlaceUpgradeFrom?: string[]; // e.g. ["win10", "win8"]
}

export interface LogEntry {
  id: string;
  time: string;
  text: string;
  level: 'info' | 'warn' | 'error' | 'success';
}
