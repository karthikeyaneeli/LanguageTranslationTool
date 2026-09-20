import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { storage } from '../utils/storage';
import { toast } from 'react-hot-toast';

export const useUser = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<string>('translator_current_user', 'Default');
  const [profiles, setProfiles] = useLocalStorage<string[]>('translator_profiles', ['Default']);

  const addProfile = useCallback(
    (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) {
        toast.error('Profile name cannot be empty.');
        return false;
      }
      if (trimmed.length > 20) {
        toast.error('Profile name is too long (max 20 chars).');
        return false;
      }
      if (profiles.map(p => p.toLowerCase()).includes(trimmed.toLowerCase())) {
        toast.error('Profile name already exists.');
        return false;
      }
      
      setProfiles((prev) => [...prev, trimmed]);
      setCurrentUser(trimmed);
      toast.success(`Profile "${trimmed}" created.`);
      return true;
    },
    [profiles, setProfiles, setCurrentUser]
  );

  const switchProfile = useCallback(
    (name: string) => {
      if (profiles.includes(name)) {
        setCurrentUser(name);
        toast.success(`Switched to profile "${name}".`);
      }
    },
    [profiles, setCurrentUser]
  );

  const deleteProfile = useCallback(
    (name: string) => {
      if (name === 'Default') {
        toast.error('Cannot delete the "Default" profile.');
        return;
      }
      if (!profiles.includes(name)) return;

      setProfiles((prev) => prev.filter((p) => p !== name));
      
      // Clean up specific profile data from localStorage
      storage.remove(`translator_history_${name}`);
      storage.remove(`translator_favorites_${name}`);
      storage.remove(`translator_recent_languages_${name}`);
      
      if (currentUser === name) {
        setCurrentUser('Default');
      }
      
      toast.success(`Profile "${name}" deleted.`);
    },
    [currentUser, profiles, setProfiles, setCurrentUser]
  );

  return {
    currentUser,
    profiles,
    addProfile,
    switchProfile,
    deleteProfile,
  };
};

export default useUser;
