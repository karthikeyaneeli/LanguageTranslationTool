import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { translateText } from '../services/translateService';

describe('translateService', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('translates text successfully using primary URL', async () => {
    const mockResponse = {
      translatedText: 'hola',
      detectedLanguage: { language: 'en', confidence: 1 },
    };

    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await translateText('hello', 'en', 'es');
    expect(result.translatedText).toBe('hola');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('falls back to mirror URLs when primary URL fails', async () => {
    // Primary URL fails (500)
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // Fallback succeeds
    const mockResponse = {
      translatedText: 'hola',
    };
    (globalThis.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await translateText('hello', 'auto', 'es');
    expect(result.translatedText).toBe('hola');
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('handles empty input or total network failure', async () => {
    (globalThis.fetch as any).mockRejectedValue(new Error('NetworkError'));

    await expect(translateText('hello', 'en', 'es')).rejects.toThrow('Network error occurred.');
  });
});
