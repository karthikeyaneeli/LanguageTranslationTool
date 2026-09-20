import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Language } from '../types/Language';
import { getLanguageName } from '../utils/languageMap';

interface LanguageSelectorProps {
  label: 'From' | 'To';
  selectedCode: string;
  onChange: (code: string) => void;
  languages: Language[];
  favorites: string[];
  toggleFavorite: (code: string) => void;
  recents: string[];
}

export const LanguageSelector = ({
  label,
  selectedCode,
  onChange,
  languages,
  favorites,
  toggleFavorite,
  recents,
}: LanguageSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const currentLanguageName = useMemo(() => {
    return getLanguageName(selectedCode, languages);
  }, [selectedCode, languages]);

  // Filter and prioritize languages
  const filteredLanguages = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = languages.filter(lang => 
      lang.name.toLowerCase().includes(query) || lang.code.toLowerCase().includes(query)
    );

    if (query) return list; // Don't group by sections when searching

    // Exclude 'auto' from favorites or recents grouping logic
    const favList = list.filter(lang => lang.code !== 'auto' && favorites.includes(lang.code));
    const recentList = list.filter(lang => 
      lang.code !== 'auto' && 
      recents.includes(lang.code) && 
      !favorites.includes(lang.code)
    );
    const standardList = list.filter(lang => 
      lang.code === 'auto' || 
      (!favorites.includes(lang.code) && !recents.includes(lang.code))
    );

    return {
      favorites: favList,
      recents: recentList,
      all: standardList
    };
  }, [languages, searchQuery, favorites, recents]);

  const handleLanguageSelect = (code: string) => {
    onChange(code);
    setIsOpen(false);
  };

  const handleStarClick = (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    toggleFavorite(code);
  };

  const renderLanguageItem = (lang: Language) => {
    const isSelected = lang.code === selectedCode;
    const isStarred = favorites.includes(lang.code);

    return (
      <div
        key={lang.code}
        onClick={() => handleLanguageSelect(lang.code)}
        className={`flex items-center justify-between px-4 py-2.5 my-0.5 rounded-xl cursor-pointer transition-all duration-150 group text-sm ${
          isSelected
            ? 'bg-indigo-500/15 text-indigo-500 font-semibold'
            : 'text-[var(--text-main)] hover:bg-[var(--icon-hover)]'
        }`}
      >
        <span className="truncate">{lang.name}</span>
        
        {lang.code !== 'auto' && (
          <button
            onClick={(e) => handleStarClick(e, lang.code)}
            className={`opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-md hover:bg-slate-500/10 transition-all cursor-pointer ${
              isStarred ? 'opacity-100 text-amber-500' : 'text-[var(--text-muted)]'
            }`}
            aria-label={isStarred ? `Unstar ${lang.name}` : `Star ${lang.name}`}
            title={isStarred ? `Unstar ${lang.name}` : `Star ${lang.name}`}
          >
            <Star className={`w-3.5 h-3.5 ${isStarred ? 'fill-amber-500' : ''}`} />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full" ref={dropdownRef}>
      <label className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-1.5 px-1">
        {label}
      </label>
      
      <div className="relative">
        {/* Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`${label} language, selected is ${currentLanguageName}`}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-[var(--icon-hover)] transition-all text-sm font-medium shadow-sm cursor-pointer"
        >
          <span className="truncate">{currentLanguageName}</span>
          <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute z-30 left-0 right-0 mt-2 rounded-2xl border border-[var(--dropdown-border)] bg-[var(--dropdown-bg)] backdrop-blur-xl shadow-xl overflow-hidden flex flex-col max-h-[350px]"
            >
              {/* Search Bar */}
              <div className="p-3 border-b border-[var(--dropdown-border)] flex items-center gap-2">
                <Search className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search languages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm text-[var(--text-main)] outline-none border-none placeholder-[var(--text-muted)] py-0.5 focus:ring-0"
                />
              </div>

              {/* Scrollable list */}
              <div className="overflow-y-auto p-1.5 flex-1">
                {Array.isArray(filteredLanguages) ? (
                  // Search query is active - render flat list
                  filteredLanguages.length > 0 ? (
                    filteredLanguages.map(lang => renderLanguageItem(lang))
                  ) : (
                    <div className="text-center py-6 text-sm text-[var(--text-muted)]">
                      No languages found.
                    </div>
                  )
                ) : (
                  // Standard view - grouped by Favorites, Recents, and All
                  <>
                    {/* Starred section */}
                    {filteredLanguages.favorites.length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wider text-amber-500 uppercase">
                          <Star className="w-3 h-3 fill-amber-500" /> Starred
                        </div>
                        {filteredLanguages.favorites.map(lang => renderLanguageItem(lang))}
                      </div>
                    )}

                    {/* Recents section */}
                    {filteredLanguages.recents.length > 0 && (
                      <div className="mb-2">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-wider text-indigo-500 uppercase">
                          <Clock className="w-3 h-3" /> Recent
                        </div>
                        {filteredLanguages.recents.map(lang => renderLanguageItem(lang))}
                      </div>
                    )}

                    {/* All languages section */}
                    <div>
                      {filteredLanguages.favorites.length > 0 || filteredLanguages.recents.length > 0 ? (
                        <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-[var(--text-muted)] uppercase border-t border-[var(--dropdown-border)] mt-1.5 pt-2 mb-0.5">
                          All Languages
                        </div>
                      ) : null}
                      {filteredLanguages.all.map(lang => renderLanguageItem(lang))}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LanguageSelector;
