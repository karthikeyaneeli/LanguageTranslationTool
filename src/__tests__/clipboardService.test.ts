// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { copyToClipboard } from '../services/clipboardService';

describe('clipboardService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('uses navigator.clipboard if available', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });

    const result = await copyToClipboard('text to copy');
    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('text to copy');
  });

  it('falls back to document.execCommand if navigator.clipboard is not available', async () => {
    // Remove navigator.clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });

    if (typeof document.execCommand === 'undefined') {
      Object.defineProperty(document, 'execCommand', {
        value: () => true,
        writable: true,
        configurable: true,
      });
    }

    const mockExec = vi.spyOn(document, 'execCommand').mockReturnValue(true);

    const result = await copyToClipboard('fallback copy');
    expect(result).toBe(true);
    expect(mockExec).toHaveBeenCalledWith('copy');
  });
});
