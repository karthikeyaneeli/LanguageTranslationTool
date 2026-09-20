import { useState, useEffect, useCallback } from 'react';
import { speechService } from '../services/speechService';
import { toast } from 'react-hot-toast';

export const useSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
    } else {
      speechService.initVoices();
    }

    // Stop speaking when hook unmounts
    return () => {
      speechService.stop();
    };
  }, []);

  const speak = useCallback((text: string, languageCode: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      toast.error('Speech synthesis not supported.');
      return;
    }

    if (!text.trim()) {
      toast.error('No text to speak.');
      return;
    }

    speechService.speak(
      text,
      languageCode,
      // onStart
      () => {
        setIsPlaying(true);
        setIsPaused(false);
      },
      // onEnd
      () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      // onError
      (error) => {
        setIsPlaying(false);
        setIsPaused(false);
        toast.error(error);
      }
    );
  }, []);

  const pause = useCallback(() => {
    speechService.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    speechService.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    speechService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  return {
    isSupported,
    isPlaying,
    isPaused,
    speak,
    pause,
    resume,
    stop,
  };
};

export default useSpeech;
