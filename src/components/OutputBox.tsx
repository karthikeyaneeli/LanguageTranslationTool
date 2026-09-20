import { useRef, useEffect, useMemo } from 'react';
import LanguageSelector from './LanguageSelector';
import CopyButton from './CopyButton';
import DownloadButton from './DownloadButton';
import type { Language } from '../types/Language';
import { getLanguageName } from '../utils/languageMap';
import { SOURCE_LANGUAGES } from '../utils/constants';

interface OutputBoxProps {
  value: string;
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  languages: Language[];
  favorites: string[];
  toggleFavorite: (code: string) => void;
  recents: string[];
  detectedLanguageCode?: string;
  inputText: string;
  sourceLanguageName: string;
  targetLanguageName: string;
  isLoading: boolean;
}

export const OutputBox = ({
  value,
  selectedLanguage,
  onLanguageChange,
  languages,
  favorites,
  toggleFavorite,
  recents,
  detectedLanguageCode,
  inputText,
  sourceLanguageName,
  targetLanguageName,
  isLoading,
}: OutputBoxProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(140, textarea.scrollHeight)}px`;
  }, [value]);

  const detectedLanguageName = useMemo(() => {
    if (!detectedLanguageCode) return undefined;
    return getLanguageName(detectedLanguageCode, SOURCE_LANGUAGES);
  }, [detectedLanguageCode]);

  return (
    <div className="glass-panel flex flex-col p-5 min-h-[280px]">
      {/* Top Header: Target Language */}
      <div className="mb-4">
        <LanguageSelector
          label="To"
          selectedCode={selectedLanguage}
          onChange={onLanguageChange}
          languages={languages}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          recents={recents}
        />
      </div>

      {/* Auto-detected Language Pill */}
      {detectedLanguageName && (
        <div className="mb-3 self-start">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
            Detected Language: <strong className="ml-1 text-emerald-400 font-bold">{detectedLanguageName}</strong>
          </span>
        </div>
      )}

      {/* Main Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={isLoading ? 'Translating...' : value}
          readOnly
          placeholder={isLoading ? 'Translating...' : 'Translated Text'}
          className={`w-full bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] border-none outline-none resize-none py-1 text-base leading-relaxed md:text-lg focus:ring-0 ${
            isLoading ? 'animate-pulse text-[var(--text-muted)]' : ''
          }`}
          aria-label="Translated output text"
        />
      </div>

      {/* Bottom Footer: Action toolbar (Copy, Speech, Download) & Output Length */}
      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-2.5 mt-2">
        <div className="flex items-center gap-1.5 -ml-1">
          {value.trim() && !isLoading && (
            <>
              <CopyButton text={value} />
              <DownloadButton
                inputText={inputText}
                translatedText={value}
                sourceLanguageName={sourceLanguageName}
                targetLanguageName={targetLanguageName}
              />
            </>
          )}
        </div>
        <span className="text-xs font-mono text-[var(--text-muted)]">
          {value.length} characters
        </span>
      </div>
    </div>
  );
};

export default OutputBox;
