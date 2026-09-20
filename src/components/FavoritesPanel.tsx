import { X, Star, Sparkles } from 'lucide-react';
import type { Language } from '../types/Language';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  onSelectLanguage: (code: string) => void;
  onRemoveFavorite: (code: string) => void;
  languages: Language[];
}

export const FavoritesPanel = ({
  isOpen,
  onClose,
  favorites,
  onSelectLanguage,
  onRemoveFavorite,
  languages,
}: FavoritesPanelProps) => {
  // Lock body scroll when drawer is open
  const scrollLocked = (lock: boolean) => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = lock ? 'hidden' : 'unset';
  };

  if (isOpen) {
    scrollLocked(true);
  } else {
    scrollLocked(false);
  }

  const favoriteLanguages = languages.filter((lang) => favorites.includes(lang.code));

  const handleSelect = (code: string) => {
    onSelectLanguage(code);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Faded Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[3px]"
          />

          {/* Left Sliding Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 bottom-0 left-0 z-50 w-full sm:w-[400px] bg-[var(--dropdown-bg)] border-r border-[var(--dropdown-border)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-[var(--dropdown-border)] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" /> Starred Languages
                </h2>
                <p className="text-xs text-[var(--text-muted)]">Your favorite translation languages</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--icon-hover)] transition-colors cursor-pointer"
                title="Close favorites"
                aria-label="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {favoriteLanguages.length > 0 ? (
                  favoriteLanguages.map((lang) => (
                    <motion.div
                      key={lang.code}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="p-3.5 rounded-2xl border border-[var(--card-border)] bg-slate-500/5 dark:bg-white/5 hover:bg-slate-500/10 dark:hover:bg-white/10 cursor-pointer transition-all duration-150 flex items-center justify-between group"
                      onClick={() => handleSelect(lang.code)}
                      layout
                    >
                      <span className="text-sm font-semibold text-[var(--text-main)]">
                        {lang.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFavorite(lang.code);
                        }}
                        className="p-1.5 rounded-xl hover:bg-amber-500/10 text-amber-500 transition-colors cursor-pointer"
                        title={`Remove ${lang.name} from favorites`}
                        aria-label={`Remove ${lang.name} from favorites`}
                      >
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center gap-3 text-[var(--text-muted)]"
                  >
                    <div className="p-4 bg-slate-500/5 dark:bg-white/5 rounded-full">
                      <Sparkles className="w-8 h-8 opacity-45 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--text-main)]">No favorites starred yet</p>
                      <p className="text-xs max-w-[220px] mt-1 mx-auto">
                        Star languages inside dropdown menus to display them here for instant access.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FavoritesPanel;
