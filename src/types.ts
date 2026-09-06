export type LanguageCode = 'en' | 'zh' | 'fr' | 'ja' | 'ru';

export type ThemeMode = 'system' | 'dark' | 'light';

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

export type Architecture = 'x64' | 'x86' | 'x64 / x86' | 'arm64';

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
  | 'preview';

export type ActivationMethod =
  | 'hwid'
  | 'kms38'
  | 'kms'
  | 'oem_slic'
  | 'legacy_vl'
  | 'avma';

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
  | 'slmgr_status';

export interface LogEntry {
  id: string;
  time: string;
  text: string;
  level: 'info' | 'warn' | 'error' | 'success';
}
