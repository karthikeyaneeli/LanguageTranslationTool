import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ClearButtonProps {
  onClear: () => void;
  disabled?: boolean;
}

export const ClearButton = ({ onClear, disabled }: ClearButtonProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClear}
      disabled={disabled}
      className="p-2 rounded-xl hover:bg-[var(--icon-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
      whileHover={disabled ? {} : { scale: 1.08 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      aria-label="Clear input text"
      title="Clear text"
    >
      <X className="w-4 h-4 md:w-5 md:h-5" />
    </motion.button>
  );
};

export default ClearButton;
