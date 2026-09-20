import { useState, useCallback, useEffect } from 'react';
import { storage } from '../utils/storage';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.get(key, initialValue);
  });

  // Re-sync with storage if key changes dynamically
  useEffect(() => {
    setStoredValue(storage.get(key, initialValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      storage.set(key, valueToStore);
      return valueToStore;
    });
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
