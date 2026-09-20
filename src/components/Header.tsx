import { useState, useRef, useEffect } from 'react';
import { Languages, History, Star, User, Plus, Check, Trash2 } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onToggleHistory: () => void;
  onToggleFavorites: () => void;
  favoritesCount: number;
  currentUser: string;
  profiles: string[];
  onSwitchProfile: (name: string) => void;
  onAddProfile: (name: string) => boolean;
  onDeleteProfile: (name: string) => void;
}

export const Header = ({
  onToggleHistory,
  onToggleFavorites,
  favoritesCount,
  currentUser,
  profiles,
  onSwitchProfile,
  onAddProfile,
  onDeleteProfile,
}: HeaderProps) => {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const userRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddProfile(newProfileName)) {
      setNewProfileName('');
    }
  };

  return (
    <header className="w-full py-6 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[var(--card-border)] mb-6 md:mb-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-start gap-3.5">
        <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
          <Languages className="w-6 h-6 md:w-7 md:h-7" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-[var(--text-main)]">
            Language Translation Tool
          </h1>
          <p className="text-xs md:text-sm text-[var(--text-sub)]">
            Translate text instantly across multiple languages
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3 self-end md:self-center">
        {/* User Switcher Component */}
        <div className="relative" ref={userRef}>
          <motion.button
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center gap-1.5 p-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-[var(--text-main)] hover:bg-[var(--icon-hover)] transition-all text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer shadow-sm max-w-[150px] md:max-w-[180px]"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="User profiles menu"
            title="Switch User Profile"
          >
            <User className="w-4 h-4 text-indigo-500 shrink-0" />
            <span className="truncate">{currentUser}</span>
          </motion.button>

          <AnimatePresence>
            {isUserOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-[var(--dropdown-border)] bg-[var(--dropdown-bg)] backdrop-blur-xl shadow-xl z-30 p-2.5 flex flex-col gap-2.5"
              >
                <div className="px-2 pt-1">
                  <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">Switch Profile</h3>
                </div>

                {/* Profiles List */}
                <div className="max-h-36 overflow-y-auto flex flex-col gap-0.5 pr-1">
                  {profiles.map((profile) => {
                    const isActive = profile === currentUser;
                    return (
                      <div
                        key={profile}
                        onClick={() => {
                          onSwitchProfile(profile);
                          setIsUserOpen(false);
                        }}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer text-xs font-medium transition-all group ${
                          isActive
                            ? 'bg-indigo-500/10 text-indigo-500 font-bold'
                            : 'text-[var(--text-main)] hover:bg-[var(--icon-hover)]'
                        }`}
                      >
                        <span className="truncate pr-2">{profile}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {isActive && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                          {profile !== 'Default' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProfile(profile);
                              }}
                              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-md text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                              title={`Delete profile "${profile}"`}
                              aria-label={`Delete profile "${profile}"`}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[var(--dropdown-border)] pt-2.5">
                  {/* Create New Profile Form */}
                  <form onSubmit={handleAddProfileSubmit} className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Add profile..."
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-[var(--dropdown-border)] bg-slate-500/5 dark:bg-white/5 text-[11px] text-[var(--text-main)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                      maxLength={20}
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors cursor-pointer flex items-center justify-center shrink-0"
                      title="Add profile"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <span className="w-px h-6 bg-[var(--card-border)] mx-0.5" />

        {/* Favorites Trigger Button */}
        <motion.button
          onClick={onToggleFavorites}
          className="relative p-2.5 rounded-xl hover:bg-[var(--icon-hover)] text-[var(--text-main)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer flex items-center justify-center gap-1.5"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Favorite Languages"
          title="Favorite Languages"
        >
          <Star className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-amber-400 text-amber-400' : ''}`} />
          {favoritesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {favoritesCount}
            </span>
          )}
        </motion.button>

        {/* History Trigger Button */}
        <motion.button
          onClick={onToggleHistory}
          className="p-2.5 rounded-xl hover:bg-[var(--icon-hover)] text-[var(--text-main)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Translation History"
          title="Translation History"
        >
          <History className="w-5 h-5" />
        </motion.button>

        <span className="w-px h-6 bg-[var(--card-border)] mx-0.5" />

        {/* Dark Mode Toggle */}
        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Header;
