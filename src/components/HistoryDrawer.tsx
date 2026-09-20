import { X, Trash2, Inbox } from 'lucide-react';
import type { TranslationHistory } from '../types/Translation';
import { SOURCE_LANGUAGES, TARGET_LANGUAGES } from '../utils/constants';
import { getLanguageName } from '../utils/languageMap';
import HistoryItem from './HistoryItem';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: TranslationHistory[];
  onSelect: (item: TranslationHistory) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onDelete,
  onClearAll,
}: HistoryDrawerProps) => {
  // Disable body scroll when drawer is open
  const scrollLocked = (lock: boolean) => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = lock ? 'hidden' : 'unset';
  };

  if (isOpen) {
    scrollLocked(true);
  } else {
    scrollLocked(false);
  }

  const handleSelect = (item: TranslationHistory) => {
    onSelect(item);
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

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 bottom-0 right-0 z-50 w-full sm:w-[420px] bg-[var(--dropdown-bg)] border-l border-[var(--dropdown-border)] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-5 border-b border-[var(--dropdown-border)] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Translation History</h2>
                <p className="text-xs text-[var(--text-muted)]">Last 10 translation records</p>
              </div>
              <div className="flex items-center gap-1">
                {history.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Clear all history"
                    aria-label="Clear all translation history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--icon-hover)] transition-colors cursor-pointer"
                  title="Close history"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {history.length > 0 ? (
                  history.map((item) => {
                    const srcLangName = getLanguageName(item.sourceLanguage, SOURCE_LANGUAGES);
                    const tgtLangName = getLanguageName(item.targetLanguage, TARGET_LANGUAGES);
                    return (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        onSelect={handleSelect}
                        onDelete={onDelete}
                        sourceLangName={srcLangName}
                        targetLangName={tgtLangName}
                      />
                    );
                  })
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center gap-3 text-[var(--text-muted)]"
                  >
                    <div className="p-4 bg-slate-500/5 dark:bg-white/5 rounded-full">
                      <Inbox className="w-8 h-8 opacity-45" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[var(--text-main)]">No translations saved</p>
                      <p className="text-xs max-w-[200px] mt-1 mx-auto">Your recent translation history will appear here.</p>
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

export default HistoryDrawer;
