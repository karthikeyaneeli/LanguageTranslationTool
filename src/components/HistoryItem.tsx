import { Trash2, ArrowRight } from 'lucide-react';
import type { TranslationHistory } from '../types/Translation';
import { formatDate } from '../utils/formatDate';
import { motion } from 'framer-motion';

interface HistoryItemProps {
  item: TranslationHistory;
  onSelect: (item: TranslationHistory) => void;
  onDelete: (id: string) => void;
  sourceLangName: string;
  targetLangName: string;
}

export const HistoryItem = ({
  item,
  onSelect,
  onDelete,
  sourceLangName,
  targetLangName,
}: HistoryItemProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  return (
    <motion.div
      onClick={() => onSelect(item)}
      className="p-4 rounded-2xl border border-[var(--card-border)] bg-slate-500/5 dark:bg-white/5 hover:bg-slate-500/10 dark:hover:bg-white/10 cursor-pointer transition-all duration-200 group relative flex flex-col gap-1.5"
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-sub)]">
          <span>{sourceLangName}</span>
          <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
          <span>{targetLangName}</span>
        </div>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">
          {formatDate(item.date)}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 pr-8">
        <p className="text-sm font-medium text-[var(--text-main)] truncate">
          {item.inputText}
        </p>
        <p className="text-sm text-[var(--text-sub)] truncate">
          {item.translatedText}
        </p>
      </div>

      <button
        onClick={handleDeleteClick}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
        aria-label="Delete history item"
        title="Delete history item"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default HistoryItem;
