import React, { useState, useRef, useEffect } from 'react';
import { Globe, Sun, Moon, Monitor, Check, HelpCircle, Terminal, Minus, Square, X } from 'lucide-react';
import { LanguageCode, ThemeMode, ActiveDialog } from '../types';
import { translations } from '../translations';

interface TitleBarProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  themeMode: ThemeMode;
  onThemeModeCycle: () => void;
  onOpenDialog: (dialog: ActiveDialog) => void;
  showLogs: boolean;
  onToggleLogs: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  language,
  onLanguageChange,
  themeMode,
  onThemeModeCycle,
  onOpenDialog,
  showLogs,
  onToggleLogs,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '简体中文' },
    { code: 'ja', label: '日本語' },
    { code: 'fr', label: 'Français' },
    { code: 'ru', label: 'Русский' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = () => {
    if (themeMode === 'dark') return <Moon className="w-3.5 h-3.5" />;
    if (themeMode === 'light') return <Sun className="w-3.5 h-3.5" />;
    return <Monitor className="w-3.5 h-3.5" />;
  };

  const getThemeModeName = () => {
    if (themeMode === 'dark') return t.ThemeMode_Dark;
    if (themeMode === 'light') return t.ThemeMode_Light;
    return t.ThemeMode_System;
  };

  return (
    <header className="h-12 border-b border-black/10 dark:border-white/10 flex items-center justify-between px-3 select-none bg-white/70 dark:bg-[#202020]/80 backdrop-blur-md sticky top-0 z-30">
      {/* Left: Window Icon & Title */}
      <div className="flex items-center space-x-2.5">
        <img
          src="/CMWTAT.png"
          alt="CMWTAT Icon"
          className="w-5 h-5 object-contain"
        />
        <div className="flex items-baseline space-x-2">
          <span className="text-[13px] font-medium tracking-tight text-neutral-800 dark:text-neutral-100">
            {t.TitleName}
          </span>
          <span className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500 bg-neutral-200/60 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
            Preview v3.0.1
          </span>
        </div>
      </div>

      {/* Right: Actions & Window Controls */}
      <div className="flex items-center space-x-1">
        {/* Terminal / Logs Toggle */}
        <button
          onClick={onToggleLogs}
          title={t.LogsToolTip}
          className={`p-1.5 rounded text-xs transition-colors flex items-center justify-center ${
            showLogs
              ? 'bg-blue-600 text-white'
              : 'text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Help & Args Button */}
        <button
          onClick={() => onOpenDialog('help')}
          title={t.HelpToolTip}
          className="p-1.5 rounded text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 text-xs transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Language Menu */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            title={t.LangSwitchToolTip}
            className="p-1.5 rounded text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 text-xs transition-colors flex items-center"
          >
            <Globe className="w-4 h-4" />
          </button>

          {langMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-[#2b2b2b] border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl py-1 z-50 text-xs text-neutral-800 dark:text-neutral-100">
              {languages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => {
                    onLanguageChange(item.code);
                    setLangMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700/60 flex items-center justify-between transition-colors"
                >
                  <span>{item.label}</span>
                  {language === item.code && <Check className="w-3.5 h-3.5 text-blue-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onThemeModeCycle}
          title={t.ThemeSwitchToolTip.replace('{0}', getThemeModeName())}
          className="p-1.5 rounded text-neutral-600 dark:text-neutral-300 hover:bg-black/5 dark:hover:bg-white/10 text-xs transition-colors"
        >
          {getThemeIcon()}
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
            onClick={() => onOpenDialog('help')}
            className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:bg-red-500 hover:text-white rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
