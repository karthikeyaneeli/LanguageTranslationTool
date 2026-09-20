// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHistory } from '../hooks/useHistory';

// Mock react-hot-toast to prevent UI call exceptions in test env
vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  default: {
    success: vi.fn(),
    error: vi.fn(),
  }
}));

describe('useHistory hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts with an empty history list', () => {
    const { result } = renderHook(() => useHistory());
    expect(result.current.history).toEqual([]);
  });

  it('adds items up to max limit and respects FIFO order', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addHistoryItem('hello 1', 'hola 1', 'en', 'es');
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].inputText).toBe('hello 1');

    // Add 10 more items (max history size is 10)
    act(() => {
      for (let i = 2; i <= 12; i++) {
        result.current.addHistoryItem(`hello ${i}`, `hola ${i}`, 'en', 'es');
      }
    });

    // Length should be capped at 10
    expect(result.current.history.length).toBe(10);
    // The newest item (hello 12) should be first
    expect(result.current.history[0].inputText).toBe('hello 12');
    // The oldest item (hello 1) should be pushed out
    const findHello1 = result.current.history.find((item) => item.inputText === 'hello 1');
    expect(findHello1).toBeUndefined();
  });

  it('deletes specific items and clears all items', () => {
    const { result } = renderHook(() => useHistory());

    act(() => {
      result.current.addHistoryItem('hello 1', 'hola 1', 'en', 'es');
      result.current.addHistoryItem('hello 2', 'hola 2', 'en', 'es');
    });

    expect(result.current.history.length).toBe(2);
    const targetId = result.current.history[0].id; // hello 2 is newest, so index 0

    act(() => {
      result.current.deleteHistoryItem(targetId);
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].inputText).toBe('hello 1');

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
  });
});
