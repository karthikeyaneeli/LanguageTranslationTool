import { useState, useCallback } from 'react';
import { copyToClipboard } from '../services/clipboardService';
import { toast } from 'react-hot-toast';

export const useClipboard = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    if (!text.trim()) {
      toast.error('Please enter text to copy.');
      return;
    }

    const success = await copyToClipboard(text);
    if (success) {
      setHasCopied(true);
      toast.success('Copied successfully.');
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } else {
      toast.error('Unable to copy text.');
    }
  }, []);

  return {
    hasCopied,
    copy,
  };
};

export default useClipboard;
