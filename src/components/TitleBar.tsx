import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Sun, Moon, Check, Minus, Square, X, Search, Palette, Disc, Key } from 'lucide-react';
import { LanguageCode, ThemeMode, ActiveDialog, ThemePreset } from '../types';
import { translations } from '../translations';
import { worldLanguages } from '../data/languages';
import { getLanguageMetadata } from '../utils/languageEngine';
import appLogo from '../assets/images/app-logo.png';

interface TitleBarProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  themeMode: ThemeMode;
  onThemeModeCycle: () => void;
  onOpenDialog?: (dialog: ActiveDialog) => void;
  showLogs?: boolean;
  onToggleLogs?: () => void;
  currentTheme?: ThemePreset;
  onOpenThemePicker?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  language,
  onLanguageChange,
  themeMode,
  onThemeModeCycle,
  onOpenDialog,
  currentTheme,
  onOpenThemePicker,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  const langMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (langMenuOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setLangSearch('');
    }
  }, [langMenuOpen]);

  const currentLangMeta = useMemo(() => {
    return getLanguageMetadata(language);
  }, [language]);

  const filteredLanguages = useMemo(() => {
    const q = langSearch.trim().toLowerCase();
    if (!q) return worldLanguages;
    return worldLanguages.filter(
      (l) =>
        l.nativeName.toLowerCase().includes(q) ||
        l.englishName.toLowerCase().includes(q) ||
        l.code.toLowerCase().includes(q) ||
        (l.iso3 && l.iso3.toLowerCase().includes(q)) ||
        l.region.toLowerCase().includes(q) ||
        (q === 'bangla' && (l.code === 'bn' || l.iso3 === 'ben')) ||
        (q === 'farsi' && (l.code === 'fa' || l.iso3 === 'fas')) ||
        (q === 'castellano' && (l.code === 'es' || l.iso3 === 'spa')),
    );
  }, [langSearch]);

  const displayedLanguages = useMemo(() => {
    return filteredLanguages.slice(0, 100);
  }, [filteredLanguages]);

  const getThemeModeName = () => {
    if (currentTheme) return currentTheme.name;
    if (themeMode === 'dark') return t.ThemeMode_Dark;
    if (themeMode === 'light') return t.ThemeMode_Light;
    return t.ThemeMode_System;
  };

  return (
    <header className="h-12 sm:h-13 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-4 select-none bg-white/70 dark:bg-[#202020]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Window Icon & Title */}
      <div className="flex items-center space-x-2.5">
        <div className="relative flex items-center justify-center">
          <img
            src={appLogo}
            alt="Windows Activator Logo"
            className="h-8 sm:h-8.5 w-auto object-contain rounded-md shadow-2xs border border-neutral-300/40 dark:border-neutral-700/60 transition-transform hover:scale-105"
          />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-xs sm:text-sm font-semibold tracking-tight text-neutral-800 dark:text-neutral-100">
            {t.TitleName}
          </span>
          <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-200/70 dark:bg-neutral-800 px-1.5 py-0.2 rounded tracking-wider">
            Version 1
          </span>
        </div>
      </div>

      {/* Right: Actions & Window Controls */}
      <div className="flex items-center space-x-2">
        {/* Language Menu */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            title={t.LangSwitchToolTip}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-100/90 dark:bg-[#2c2c2e] hover:bg-neutral-200/90 dark:hover:bg-[#3a3a3c] border border-neutral-200/80 dark:border-neutral-700/80 text-xs font-semibold transition-colors flex items-center cursor-pointer gap-1.5 shadow-2xs"
          >
            <span className="text-sm shrink-0">{currentLangMeta.flag || '🌐'}</span>
            <span className="truncate max-w-[80px] sm:max-w-[120px] text-xs text-neutral-800 dark:text-neutral-200 font-medium">
              {currentLangMeta.nativeName || currentLangMeta.englishName}
            </span>
            <span className="text-[10px] font-mono font-bold px-1 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded uppercase">
              {currentLangMeta.code}
            </span>
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 sm:w-80 bg-white dark:bg-[#2b2b2b] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-2xl py-2 z-50 text-xs text-neutral-800 dark:text-neutral-100 flex flex-col max-h-[420px]">
              <div className="px-3 pb-2 border-b border-neutral-100 dark:border-neutral-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-500" />
                    World Languages
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-semibold rounded-full">
                    {worldLanguages.length.toLocaleString()} Languages (ISO 639)
                  </span>
                </div>
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 text-neutral-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={langSearch}
                    onChange={(e) => setLangSearch(e.target.value)}
                    placeholder="Search 7,300+ languages (name or code)..."
                    className="w-full pl-8 pr-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs border border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="overflow-y-auto flex-1 divide-y divide-neutral-100 dark:divide-neutral-800/40">
                {displayedLanguages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      onLanguageChange(item.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 flex items-center justify-between transition-colors cursor-pointer ${
                      language === item.code ? 'bg-blue-50/80 dark:bg-blue-900/20 font-medium' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <span className="text-base shrink-0">{item.flag}</span>
                      <div className="flex flex-col truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold truncate text-neutral-900 dark:text-neutral-100">
                            {item.nativeName}
                          </span>
                          <span className="text-[10px] font-mono px-1 py-0.1 bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded">
                            {item.code.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
                          {item.englishName} · {item.region}
                        </span>
                      </div>
                    </div>
                    {language === item.code && (
                      <Check className="w-4 h-4 text-blue-500 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
                {filteredLanguages.length === 0 && (
                  <div className="p-4 text-center text-neutral-400 text-xs">
                    No language matched &ldquo;{langSearch}&rdquo; across {worldLanguages.length.toLocaleString()} languages
                  </div>
                )}
              </div>

              {filteredLanguages.length > displayedLanguages.length && (
                <div className="px-3 py-1.5 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 text-center">
                  Showing top {displayedLanguages.length} of {filteredLanguages.length.toLocaleString()} languages
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme Button (Theme Studio) */}
        <button
          id="theme-button"
          onClick={() => {
            if (onOpenThemePicker) {
              onOpenThemePicker();
            } else if (onOpenDialog) {
              onOpenDialog('theme_picker');
            } else {
              onThemeModeCycle();
            }
          }}
          title={`Theme Studio (1,500 Themes) • Active: ${currentTheme?.name || getThemeModeName()}`}
          className="px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-neutral-200/60 dark:border-neutral-700/60 shadow-xs"
        >
          <div className="relative flex items-center justify-center">
            <Palette className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full ring-1 ring-white dark:ring-neutral-900"
              style={{ backgroundColor: currentTheme?.accentColor || '#0078d4' }}
            />
          </div>
          <span className="text-xs font-medium hidden sm:inline max-w-[120px] truncate text-neutral-700 dark:text-neutral-300">
            {currentTheme?.name ? currentTheme.name : 'Themes'}
          </span>
          {currentTheme?.mode === 'dark' ? (
            <Moon className="w-3 h-3 text-neutral-400 hidden sm:inline" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500 hidden sm:inline" />
          )}
        </button>

        {/* Windows ISO Download Center */}
        <button
          type="button"
          onClick={() => onOpenDialog?.('iso_downloader')}
          title="Windows ISO Download Center (Windows 11, 10, 8.1, 7, and All Server Versions)"
          className="px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-neutral-200/60 dark:border-neutral-700/60 shadow-xs"
        >
          <Disc className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-xs font-semibold hidden md:inline">
            ISO Downloads
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded">
            All
          </span>
        </button>

        {/* Windows XP Activation Studio */}
        <button
          type="button"
          onClick={() => onOpenDialog?.('xp_activation_tool')}
          title="Windows XP Activation Studio (Phone CID Generator, VLK Keys, WPA Offline Bypass for All XP Editions)"
          className="px-2.5 py-1.5 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-neutral-200/60 dark:border-neutral-700/60 shadow-xs"
        >
          <Key className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-semibold hidden md:inline">
            XP Activation
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 rounded">
            XP
          </span>
        </button>

        {/* Separator */}
        <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700 mx-1" />

        {/* Standard Windows Window Controls */}
        <div className="flex items-center">
          <button
            aria-label="Minimize"
            className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            aria-label="Maximize"
            disabled
            className="w-8 h-8 flex items-center justify-center text-neutral-400 opacity-40 cursor-not-allowed"
          >
            <Square className="w-2.5 h-2.5" />
          </button>
          <button
            aria-label="Close"
            onClick={() => onOpenDialog?.(null)}
            className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-red-500 hover:text-white rounded transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
