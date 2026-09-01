import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react';
import postsReducer from '../store/postsSlice';
import { usePostsByDate } from './usePostsByDate';

function makeStore(items) {
  return configureStore({
    reducer: { posts: postsReducer },
    preloadedState: { posts: { items, selectedPostId: null } },
  });
}

describe('usePostsByDate', () => {
  it('groups posts by their dateKey', () => {
    const items = [
      { id: '1', title: 'A', dateKey: '2026-09-10', time: '10:00' },
      { id: '2', title: 'B', dateKey: '2026-09-10', time: '08:00' },
      { id: '3', title: 'C', dateKey: '2026-09-11', time: '09:00' },
    ];
    const store = makeStore(items);
    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    const { result } = renderHook(() => usePostsByDate(), { wrapper });

    expect(Object.keys(result.current)).toEqual(['2026-09-10', '2026-09-11']);
    expect(result.current['2026-09-10']).toHaveLength(2);
    // sorted by time ascending within a day
    expect(result.current['2026-09-10'][0].title).toBe('B');
    expect(result.current['2026-09-10'][1].title).toBe('A');
  });

  it('returns the same object reference across re-renders when posts are unchanged', () => {
    const items = [{ id: '1', title: 'A', dateKey: '2026-09-10', time: '10:00' }];
    const store = makeStore(items);
    const wrapper = ({ children }) => <Provider store={store}>{children}</Provider>;
    const { result, rerender } = renderHook(() => usePostsByDate(), { wrapper });
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
