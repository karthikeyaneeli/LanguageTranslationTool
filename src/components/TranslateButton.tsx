import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface TranslateButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const TranslateButton = ({ onClick, isLoading, disabled }: TranslateButtonProps) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className="w-full md:w-auto px-8 py-3.5 rounded-2xl font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer disabled:opacity-65 disabled:cursor-not-allowed flex items-center justify-center gap-2.5"
      style={{
        background: 'var(--btn-gradient)',
      }}
      whileHover={isLoading || disabled ? {} : { scale: 1.03, filter: 'brightness(1.08)' }}
      whileTap={isLoading || disabled ? {} : { scale: 0.97 }}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          <span>Translating...</span>
        </>
      ) : (
        <>
          <Languages className="w-4 h-4 md:w-5 md:h-5" />
          <span>Translate</span>
        </>
      )}
    </motion.button>
  );
};

export default TranslateButton;
