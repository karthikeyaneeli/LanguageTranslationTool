// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { speechService } from '../services/speechService';

describe('speechService', () => {
  const mockSpeak = vi.fn();
  const mockCancel = vi.fn();
  const mockPause = vi.fn();
  const mockResume = vi.fn();
  const mockGetVoices = vi.fn().mockReturnValue([]);

  beforeEach(() => {
    vi.restoreAllMocks();

    class MockUtterance {
      text: string;
      lang: string = '';
      voice: any = null;
      onstart: any = null;
      onend: any = null;
      onerror: any = null;
      constructor(text: string) {
        this.text = text;
      }
    }
    globalThis.SpeechSynthesisUtterance = MockUtterance as any;

    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        speak: mockSpeak,
        cancel: mockCancel,
        pause: mockPause,
        resume: mockResume,
        getVoices: mockGetVoices,
        speaking: false,
        paused: false,
      },
      writable: true,
      configurable: true,
    });
  });

  it('triggers window.speechSynthesis.speak on speak call', () => {
    vi.useFakeTimers();
    speechService.speak('hello', 'en');
    expect(mockCancel).toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(mockSpeak).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('calls pause and resume correctly', () => {
    vi.useFakeTimers();
    // Simulate active speaking and paused states
    Object.defineProperty(window.speechSynthesis, 'speaking', { value: true, configurable: true });
    speechService.speak('test text', 'en');
    vi.advanceTimersByTime(50);
    speechService.pause();
    expect(mockPause).toHaveBeenCalled();

    Object.defineProperty(window.speechSynthesis, 'paused', { value: true, configurable: true });
    speechService.resume();
    expect(mockResume).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it('stops speaking correctly', () => {
    speechService.stop();
    expect(mockCancel).toHaveBeenCalled();
  });
});
