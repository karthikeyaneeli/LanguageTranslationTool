import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { downloadTranslation } from '../services/downloadService';
import { toast } from 'react-hot-toast';

interface DownloadButtonProps {
  inputText: string;
  translatedText: string;
  sourceLanguageName: string;
  targetLanguageName: string;
  disabled?: boolean;
}

export const DownloadButton = ({
  inputText,
  translatedText,
  sourceLanguageName,
  targetLanguageName,
  disabled,
}: DownloadButtonProps) => {
  const handleDownload = () => {
    if (disabled || !inputText.trim() || !translatedText.trim()) return;

    try {
      downloadTranslation(inputText, translatedText, sourceLanguageName, targetLanguageName);
      toast.success('Translation downloaded.');
    } catch (err: any) {
      toast.error(err.message || 'Unable to download translation.');
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleDownload}
      disabled={disabled || !inputText.trim() || !translatedText.trim()}
      className="p-2 rounded-xl hover:bg-[var(--icon-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
      whileHover={disabled || !inputText.trim() || !translatedText.trim() ? {} : { scale: 1.08 }}
      whileTap={disabled || !inputText.trim() || !translatedText.trim() ? {} : { scale: 0.92 }}
      aria-label="Download translation as text file"
      title="Download translation"
    >
      <Download className="w-4 h-4 md:w-5 md:h-5" />
    </motion.button>
  );
};

export default DownloadButton;
