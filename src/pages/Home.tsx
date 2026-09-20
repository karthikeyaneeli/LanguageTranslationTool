import { useState, useCallback, useMemo, useEffect } from 'react';
import Header from '../components/Header';
import InputBox from '../components/InputBox';
import OutputBox from '../components/OutputBox';
import SwapButton from '../components/SwapButton';
import TranslateButton from '../components/TranslateButton';
import HistoryDrawer from '../components/HistoryDrawer';
import FavoritesPanel from '../components/FavoritesPanel';
import { useTranslation } from '../hooks/useTranslation';
import { useHistory } from '../hooks/useHistory';
import { useFavorites } from '../hooks/useFavorites';
import { useRecents } from '../hooks/useRecents';
import { useClipboard } from '../hooks/useClipboard';
import { useUser } from '../hooks/useUser';
import { SOURCE_LANGUAGES, TARGET_LANGUAGES } from '../utils/constants';
import { getLanguageName } from '../utils/languageMap';
import { motion } from 'framer-motion';

export const Home = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);

  const { currentUser, profiles, addProfile, switchProfile, deleteProfile } = useUser();
  const { history, addHistoryItem, deleteHistoryItem, clearHistory } = useHistory(currentUser);
  const { favorites, toggleFavorite } = useFavorites(currentUser);
  const { recents, addRecent } = useRecents(currentUser);
  const { copy } = useClipboard();

  const handleTranslationSuccess = useCallback(
    (inputText: string, translatedText: string, srcLang: string, tgtLang: string) => {
      addHistoryItem(inputText, translatedText, srcLang, tgtLang);
      addRecent(srcLang);
      addRecent(tgtLang);
    },
    [addHistoryItem, addRecent]
  );

  const {
    inputText,
    setInputText,
    translatedText,
    setTranslatedText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    isLoading,
    detectedLanguageCode,
    translate,
    clear,
    swapLanguages,
  } = useTranslation(handleTranslationSuccess);

  const sourceLanguageName = useMemo(() => {
    return getLanguageName(sourceLanguage, SOURCE_LANGUAGES);
  }, [sourceLanguage]);

  const targetLanguageName = useMemo(() => {
    return getLanguageName(targetLanguage, TARGET_LANGUAGES);
  }, [targetLanguage]);

  // Set selected history item back into state
  const handleSelectHistoryItem = useCallback(
    (item: any) => {
      setSourceLanguage(item.sourceLanguage);
      setTargetLanguage(item.targetLanguage);
      setInputText(item.inputText);
      setTranslatedText(item.translatedText);
      addRecent(item.sourceLanguage);
      addRecent(item.targetLanguage);
    },
    [setInputText, setTranslatedText, setSourceLanguage, setTargetLanguage, addRecent]
  );

  const handleSelectFavoriteLanguage = useCallback(
    (code: string) => {
      setTargetLanguage(code);
      addRecent(code);
    },
    [setTargetLanguage, addRecent]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + Enter to Translate
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        translate();
      }
      
      // Escape to Clear
      if (e.key === 'Escape') {
        e.preventDefault();
        clear();
      }

      // Ctrl + Shift + C to Copy translated text
      if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
        e.preventDefault();
        if (translatedText.trim()) {
          copy(translatedText);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [translate, clear, translatedText, copy]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-12 flex flex-col min-h-screen">
      {/* Header Section */}
      <Header
        onToggleHistory={() => setIsHistoryOpen(true)}
        onToggleFavorites={() => setIsFavoritesOpen(true)}
        favoritesCount={favorites.length}
        currentUser={currentUser}
        profiles={profiles}
        onSwitchProfile={switchProfile}
        onAddProfile={addProfile}
        onDeleteProfile={deleteProfile}
      />

      {/* Main Translate Box Grid */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-4 lg:gap-6">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <InputBox
              value={inputText}
              onChange={setInputText}
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              languages={SOURCE_LANGUAGES}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              recents={recents}
              onClear={clear}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Swap Button container (Desktop vs Mobile layout) */}
          <div className="flex justify-center items-center py-2 lg:py-0">
            <SwapButton onSwap={swapLanguages} disabled={isLoading} />
          </div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <OutputBox
              value={translatedText}
              selectedLanguage={targetLanguage}
              onLanguageChange={setTargetLanguage}
              languages={TARGET_LANGUAGES}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              recents={recents}
              detectedLanguageCode={detectedLanguageCode}
              inputText={inputText}
              sourceLanguageName={sourceLanguageName}
              targetLanguageName={targetLanguageName}
              isLoading={isLoading}
            />
          </motion.div>
        </div>

        {/* Translate Button Container */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex justify-center mt-4"
        >
          <TranslateButton onClick={translate} isLoading={isLoading} />
        </motion.div>

        {/* Keyboard Shortcuts Guide */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          className="text-center text-xs text-[var(--text-muted)] mt-8 hidden md:block select-none"
        >
          <span className="mx-2">Press <kbd className="px-1.5 py-0.5 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] font-sans text-[10px] font-bold">Ctrl + Enter</kbd> to translate</span>
          <span className="mx-2">•</span>
          <span className="mx-2">Press <kbd className="px-1.5 py-0.5 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] font-sans text-[10px] font-bold">Esc</kbd> to clear</span>
          <span className="mx-2">•</span>
          <span className="mx-2">Press <kbd className="px-1.5 py-0.5 border border-[var(--card-border)] rounded-md bg-[var(--card-bg)] font-sans text-[10px] font-bold">Ctrl + Shift + C</kbd> to copy translation</span>
        </motion.div>
      </main>

      {/* History Side Panel Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistoryItem}
        onDelete={deleteHistoryItem}
        onClearAll={clearHistory}
      />

      {/* Favorites Side Panel Drawer */}
      <FavoritesPanel
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectLanguage={handleSelectFavoriteLanguage}
        onRemoveFavorite={toggleFavorite}
        languages={TARGET_LANGUAGES}
      />
    </div>
  );
};

export default Home;
