import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Pause, Play, Square } from 'lucide-react';
import { useSpeech } from '../hooks/useSpeech';

interface SpeechButtonProps {
  text: string;
  languageCode: string;
  disabled?: boolean;
}

export const SpeechButton = ({ text, languageCode, disabled }: SpeechButtonProps) => {
  const { isSupported, isPlaying, isPaused, speak, pause, resume, stop } = useSpeech();

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className="p-2 rounded-xl text-red-500/40 cursor-not-allowed flex items-center justify-center"
        title="Speech synthesis not supported in this browser"
        aria-label="Speech synthesis not supported"
      >
        <VolumeX className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    );
  }

  const handleSpeakClick = () => {
    if (disabled || !text.trim()) return;
    if (isPlaying) {
      stop();
    } else {
      speak(text, languageCode);
    }
  };

  return (
    <div className="flex items-center gap-0.5 bg-slate-500/5 dark:bg-white/5 rounded-xl p-0.5 border border-transparent hover:border-[var(--card-border)] transition-all">
      {/* Main Speaker / Stop Button */}
      <motion.button
        type="button"
        onClick={handleSpeakClick}
        disabled={disabled || !text.trim()}
        className={`p-2 rounded-xl hover:bg-[var(--icon-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center ${
          isPlaying ? 'text-indigo-500 font-semibold' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
        }`}
        whileHover={disabled || !text.trim() ? {} : { scale: 1.08 }}
        whileTap={disabled || !text.trim() ? {} : { scale: 0.92 }}
        aria-label={isPlaying ? 'Stop speech' : 'Listen to translated text'}
        title={isPlaying ? 'Stop' : 'Listen'}
      >
        {isPlaying ? (
          <Square className="w-4 h-4 md:w-5 md:h-5 text-red-500 fill-red-500/20" />
        ) : (
          <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
        )}
      </motion.button>

      {/* Expanded controls when playing */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex items-center overflow-hidden"
          >
            {isPaused ? (
              <motion.button
                type="button"
                onClick={resume}
                className="p-2 rounded-xl hover:bg-[var(--icon-hover)] text-emerald-500 transition-all focus:outline-none cursor-pointer flex items-center justify-center shrink-0"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                title="Resume"
                aria-label="Resume speech"
              >
                <Play className="w-4 h-4 fill-emerald-500/20" />
              </motion.button>
            ) : (
              <motion.button
                type="button"
                onClick={pause}
                className="p-2 rounded-xl hover:bg-[var(--icon-hover)] text-amber-500 transition-all focus:outline-none cursor-pointer flex items-center justify-center shrink-0"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                title="Pause"
                aria-label="Pause speech"
              >
                <Pause className="w-4 h-4 fill-amber-500/20" />
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeechButton;
