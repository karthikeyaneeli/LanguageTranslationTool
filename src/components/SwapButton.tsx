import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight } from 'lucide-react';

interface SwapButtonProps {
  onSwap: () => void;
  disabled?: boolean;
}

export const SwapButton = ({ onSwap, disabled }: SwapButtonProps) => {
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsRotated((prev) => !prev);
    onSwap();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-[var(--icon-hover)] transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      animate={{ rotate: isRotated ? 180 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={disabled ? {} : { scale: 1.08 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      aria-label="Swap source and target languages"
      title="Swap languages"
    >
      <ArrowLeftRight className="w-4 h-4 md:w-5 md:h-5 text-[var(--text-muted)]" />
    </motion.button>
  );
};

export default SwapButton;
