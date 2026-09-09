import { LanguageCode } from '../types';
import rawAllLanguages from './allLanguages.json';

export interface LanguageItem {
  code: LanguageCode;
  nativeName: string;
  englishName: string;
  region: string;
  flag: string;
  rtl?: boolean;
  popular?: boolean;
  iso3?: string;
}

export const worldLanguages: LanguageItem[] = rawAllLanguages as LanguageItem[];
export const popularLanguages: LanguageItem[] = (rawAllLanguages as LanguageItem[]).filter(
  (l) => l.popular,
);
