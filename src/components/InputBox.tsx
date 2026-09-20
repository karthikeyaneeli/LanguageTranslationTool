import { useRef, useEffect } from 'react';
import CharacterCounter from './CharacterCounter';
import ClearButton from './ClearButton';
import LanguageSelector from './LanguageSelector';
import type { Language } from '../types/Language';
import { MAX_CHARACTER_LIMIT } from '../utils/constants';

interface InputBoxProps {
  value: string;
  onChange: (val: string) => void;
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
  languages: Language[];
  favorites: string[];
  toggleFavorite: (code: string) => void;
  recents: string[];
  onClear: () => void;
  isLoading: boolean;
}

export const InputBox = ({
  value,
  onChange,
  selectedLanguage,
  onLanguageChange,
  languages,
  favorites,
  toggleFavorite,
  recents,
  onClear,
  isLoading,
}: InputBoxProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.max(140, textarea.scrollHeight)}px`;
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (val.length <= MAX_CHARACTER_LIMIT) {
      onChange(val);
    }
  };

  return (
    <div className="glass-panel flex flex-col p-5 min-h-[280px]">
      {/* Top Header: Source Language */}
      <div className="mb-4">
        <LanguageSelector
          label="From"
          selectedCode={selectedLanguage}
          onChange={onLanguageChange}
          languages={languages}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          recents={recents}
        />
      </div>

      {/* Main Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder="Enter text here..."
          disabled={isLoading}
          className="w-full bg-transparent text-[var(--text-main)] placeholder-[var(--text-muted)] border-none outline-none resize-none py-1 text-base leading-relaxed md:text-lg focus:ring-0"
          aria-label="Source text to translate"
          maxLength={MAX_CHARACTER_LIMIT}
        />
      </div>

      {/* Bottom Footer: Character Count & Clear */}
      <div className="flex items-center justify-between border-t border-[var(--card-border)] pt-3.5 mt-2">
        <div>
          {value.trim() && (
            <ClearButton onClear={onClear} disabled={isLoading} />
          )}
        </div>
        <CharacterCounter current={value.length} max={MAX_CHARACTER_LIMIT} />
      </div>
    </div>
  );
};

export default InputBox;
