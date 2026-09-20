import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <motion.button
      onClick={toggleDarkMode}
      className="p-2.5 rounded-xl hover:bg-[var(--icon-hover)] text-[var(--text-main)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 180 : 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="flex items-center justify-center"
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-amber-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default DarkModeToggle;
