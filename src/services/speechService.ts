import { LANGUAGE_TO_SPEECH_LOCALE } from '../utils/languageMap';

class SpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  public speak(
    text: string,
    languageCode: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void,
    isFallbackRun = false
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError('Speech synthesis not supported.');
      return;
    }

    try {
      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      const locale = LANGUAGE_TO_SPEECH_LOCALE[languageCode];
      
      if (locale && languageCode !== 'default_fallback') {
        utterance.lang = locale;

        // Find matching voice
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(
          (v) => v.lang.toLowerCase() === locale.toLowerCase() ||
                 v.lang.toLowerCase().startsWith(locale.split('-')[0].toLowerCase())
        );

        if (voice) {
          utterance.voice = voice;
        }
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (typeof window !== 'undefined') {
          (window as any).activeUtterances = ((window as any).activeUtterances || []).filter((u: any) => u !== utterance);
        }
        if (onEnd) onEnd();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        if (typeof window !== 'undefined') {
          (window as any).activeUtterances = ((window as any).activeUtterances || []).filter((u: any) => u !== utterance);
        }

        if (event.error === 'interrupted') return; // Don't trigger error for user cancellation

        // Proactive fallback if the voice engine or language pack is not installed on the system
        if ((event.error === 'language-unavailable' || event.error === 'voice-unavailable') && !isFallbackRun) {
          console.warn(`Speech synthesis voice for locale "${locale}" is unavailable. Falling back to default voice.`);
          this.speak(text, 'default_fallback', onStart, onEnd, onError, true);
          return;
        }

        if (onError) onError(`Speech synthesis error: ${event.error}`);
      };

      this.currentUtterance = utterance;

      // Keep strong reference on window to bypass aggressive garbage collection in Chrome
      if (typeof window !== 'undefined') {
        (window as any).activeUtterances = (window as any).activeUtterances || [];
        (window as any).activeUtterances.push(utterance);
      }

      // Use a short setTimeout to let speechSynthesis cancel finalize, preventing chrome freeze bug
      setTimeout(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.speak(utterance);
        }
      }, 50);
    } catch (err: any) {
      if (onError) onError(err.message || 'Speech synthesis failed.');
    }
  }

  public pause(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.resume(); // Force unpause in case the browser got stuck in a paused state
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return this.currentUtterance !== null && window.speechSynthesis.speaking;
  }

  public isPaused(): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return this.currentUtterance !== null && window.speechSynthesis.paused;
  }

  // Forces voices to load in browsers where voices are loaded asynchronously (like Chrome)
  public initVoices(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume(); // Resume if stuck paused on load
      }
      if ('onvoiceschanged' in window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }
}

export const speechService = new SpeechService();
export default speechService;
