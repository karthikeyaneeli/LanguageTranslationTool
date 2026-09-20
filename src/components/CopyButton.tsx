import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../hooks/useClipboard';

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
}

export const CopyButton = ({ text, disabled }: CopyButtonProps) => {
  const { hasCopied, copy } = useClipboard();

  const handleCopy = () => {
    if (disabled || !text.trim()) return;
    copy(text);
  };

  return (
    <motion.button
      type="button"
      onClick={handleCopy}
      disabled={disabled || !text.trim()}
      className="p-2 rounded-xl hover:bg-[var(--icon-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
      whileHover={disabled || !text.trim() ? {} : { scale: 1.08 }}
      whileTap={disabled || !text.trim() ? {} : { scale: 0.92 }}
      aria-label="Copy translation to clipboard"
      title="Copy to clipboard"
    >
      {hasCopied ? (
        <Check className="w-4 h-4 md:w-5 md:h-5 text-emerald-500" />
      ) : (
        <Copy className="w-4 h-4 md:w-5 md:h-5" />
      )}
    </motion.button>
  );
};

export default CopyButton;
