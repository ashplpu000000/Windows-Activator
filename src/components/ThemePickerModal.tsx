import React, { useState, useMemo } from 'react';
import { X, Search, Sparkles, Check, Moon, Sun, RotateCcw, Palette } from 'lucide-react';
import { ThemePreset } from '../types';
import { themes, themeCategories, defaultTheme } from '../data/themes';

interface ThemePickerModalProps {
  currentTheme: ThemePreset;
  onSelectTheme: (theme: ThemePreset) => void;
  onClose: () => void;
}

export const ThemePickerModal: React.FC<ThemePickerModalProps> = ({
  currentTheme,
  onSelectTheme,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [modeFilter, setModeFilter] = useState<'all' | 'dark' | 'light'>('all');
  const [visibleLimit, setVisibleLimit] = useState<number>(96);

  const darkCount = useMemo(() => themes.filter((t) => t.mode === 'dark').length, []);
  const lightCount = useMemo(() => themes.filter((t) => t.mode === 'light').length, []);

  const filteredThemes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return themes.filter((t) => {
      // Category filter
      if (selectedCategory !== 'All' && t.category !== selectedCategory) {
        return false;
      }
      // Mode filter
      if (modeFilter !== 'all' && t.mode !== modeFilter) {
        return false;
      }
      // Search query
      if (q) {
        return (
          t.name.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, selectedCategory, modeFilter]);

  // Reset pagination limit when filters change
  React.useEffect(() => {
    setVisibleLimit(96);
  }, [searchQuery, selectedCategory, modeFilter]);

  const displayedThemes = useMemo(() => {
    return filteredThemes.slice(0, visibleLimit);
  }, [filteredThemes, visibleLimit]);

  const handleRandomTheme = () => {
    const pool = filteredThemes.length > 0 ? filteredThemes : themes;
    const randomIndex = Math.floor(Math.random() * pool.length);
    onSelectTheme(pool[randomIndex]);
  };

  return (
    <div
      id="theme-picker-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="theme-picker-dialog"
        className="w-full max-w-5xl h-[90vh] max-h-[820px] bg-neutral-900 text-neutral-100 rounded-2xl shadow-2xl border border-neutral-700/80 flex flex-col overflow-hidden"
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: currentTheme.accentColor }}
            >
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  Theme Studio
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {themes.length.toLocaleString()} Themes
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Choose from {themes.length.toLocaleString()} hand-crafted styles across {themeCategories.length} rich collections
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRandomTheme}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 flex items-center space-x-1.5 transition-colors border border-neutral-700 cursor-pointer"
              title="Surprise me with a random theme"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Random</span>
            </button>

            <button
              onClick={() => onSelectTheme(defaultTheme)}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-neutral-200 flex items-center space-x-1.5 transition-colors border border-neutral-700 cursor-pointer"
              title="Reset to default Windows 11 Mica"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 border-b border-neutral-800/80 bg-neutral-900/60 flex-shrink-0 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${themes.length.toLocaleString()} themes (name, collection, color)...`}
              className="w-full pl-9 pr-8 py-2 bg-neutral-800/90 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mode Tabs (All / Dark / Light) */}
          <div className="flex items-center space-x-1 bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/60 self-stretch sm:self-auto justify-center">
            <button
              onClick={() => setModeFilter('all')}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer ${
                modeFilter === 'all'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All ({themes.length})
            </button>
            <button
              onClick={() => setModeFilter('dark')}
              className={`px-3 py-1 text-xs rounded-lg font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                modeFilter === 'dark'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark ({darkCount})</span>
            </button>
            <button
              onClick={() => setModeFilter('light')}
              className={`px-3 py-1 text-xs rounded-lg font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                modeFilter === 'light'
                  ? 'bg-neutral-700 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Light ({lightCount})</span>
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scrolling Filter */}
        <div className="px-4 py-2.5 border-b border-neutral-800/60 bg-neutral-950/40 flex-shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/80'
            }`}
          >
            All Collections ({themes.length})
          </button>
          {themeCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                  : 'bg-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/80'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] opacity-70 bg-black/30 px-1.5 py-0.2 rounded-full">
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Theme Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 custom-scrollbar">
          {displayedThemes.map((item) => {
            const isSelected = currentTheme.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectTheme(item)}
                className={`group relative rounded-xl border p-3 flex flex-col justify-between transition-all cursor-pointer select-none text-left overflow-hidden ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg ring-2 ring-blue-500/40'
                    : 'border-neutral-800 bg-neutral-800/40 hover:bg-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Mini Preview Mockup */}
                <div
                  className="w-full h-24 rounded-lg overflow-hidden border border-black/20 flex flex-col p-1.5 shadow-inner transition-transform group-hover:scale-[1.02]"
                  style={{ background: item.bgGradient }}
                >
                  {/* Mini window */}
                  <div
                    className="w-full h-full rounded shadow-md flex flex-col overflow-hidden"
                    style={{ background: item.windowBg, border: `1px solid ${item.borderCol}` }}
                  >
                    {/* Mini titlebar */}
                    <div
                      className="h-4 px-1.5 flex items-center justify-between"
                      style={{ background: item.headerBg }}
                    >
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: item.accentColor }} />
                        <div
                          className="h-1.5 w-12 rounded-sm"
                          style={{ background: item.mode === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
                        />
                      </div>
                      <div className="flex space-x-0.5">
                        <div className="w-1.5 h-1 rounded-sm bg-neutral-500/40" />
                        <div className="w-1.5 h-1 rounded-sm bg-neutral-500/40" />
                      </div>
                    </div>

                    {/* Mini body */}
                    <div className="p-1.5 flex-1 flex flex-col justify-between">
                      <div
                        className="p-1 rounded flex items-center justify-between"
                        style={{ background: item.cardBg }}
                      >
                        <div
                          className="h-1.5 w-14 rounded-sm"
                          style={{ background: item.textColor, opacity: 0.7 }}
                        />
                        <div
                          className="h-2.5 w-7 rounded-sm flex items-center justify-center text-[7px] text-white font-bold"
                          style={{ background: item.accentColor }}
                        >
                          ACT
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[8px]">
                        <span style={{ color: item.secondaryText }}>Status: Ready</span>
                        <div className="w-2 h-2 rounded-full" style={{ background: item.accentColor }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Information */}
                <div className="mt-2.5 flex items-start justify-between gap-1">
                  <div className="truncate flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: item.accentColor }}
                      />
                      <h3 className="text-xs font-semibold text-neutral-200 truncate group-hover:text-white">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {item.category}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    {item.mode === 'dark' ? (
                      <Moon className="w-3 h-3 text-neutral-400" />
                    ) : (
                      <Sun className="w-3 h-3 text-amber-400" />
                    )}
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-blue-500 text-white">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load More Pagination Bar */}
          {visibleLimit < filteredThemes.length && (
            <div className="col-span-full py-6 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-neutral-800/80 mt-2">
              <span className="text-xs text-neutral-400">
                Displaying {displayedThemes.length} of {filteredThemes.length} filtered themes
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVisibleLimit((prev) => prev + 96)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
                >
                  Load 96 More
                </button>
                <button
                  onClick={() => setVisibleLimit(filteredThemes.length)}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium text-xs border border-neutral-700 transition-all cursor-pointer"
                >
                  Show All ({filteredThemes.length})
                </button>
              </div>
            </div>
          )}

          {filteredThemes.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-400">
              <Palette className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No themes match your criteria</p>
              <p className="text-xs text-neutral-500 mt-1">Try clearing the search or category filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setModeFilter('all');
                }}
                className="mt-3 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-200 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer info & active selection */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-neutral-950/70 flex-shrink-0 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center space-x-2">
            <span>
              Showing <strong className="text-neutral-200">{displayedThemes.length}</strong> of{' '}
              <strong className="text-neutral-200">{filteredThemes.length}</strong>{' '}
              {filteredThemes.length !== themes.length && (
                <span className="text-neutral-500">({themes.length.toLocaleString()} total)</span>
              )}
            </span>
            <span className="text-neutral-600">•</span>
            <span className="hidden sm:inline">Active:</span>
            <span className="font-medium text-white flex items-center space-x-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: currentTheme.accentColor }}
              />
              <span>{currentTheme.name}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
