import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, screen, fireEvent, within } from '@testing-library/react';
import postsReducer from '../../store/postsSlice';
import CalendarView from './CalendarView';
import { toDateKey } from '../../utils/dateUtils';

function renderWithStore(preloadedItems = []) {
  const store = configureStore({
    reducer: { posts: postsReducer },
    preloadedState: { posts: { items: preloadedItems, selectedPostId: null } },
  });
  return { store, ...render(<Provider store={store}><CalendarView /></Provider>) };
}

describe('CalendarView integration', () => {
  it('renders a full month grid of day cells', () => {
    renderWithStore();
    // Every rendered day cell has a data-testid of the form day-cell-YYYY-MM-DD
    const cells = screen.getAllByText(/^\d{1,2}$/);
    expect(cells.length).toBeGreaterThanOrEqual(28);
  });

  it('creates a new post through the modal and displays it on the correct day', () => {
    const { store } = renderWithStore();

    const todayKey = toDateKey(new Date());
    const todayCell = screen.getByTestId(`day-cell-${todayKey}`);

    fireEvent.click(todayCell);

    // Modal should open
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/product launch teaser/i), {
      target: { value: 'New sponsored post' },
    });

    fireEvent.click(screen.getByRole('button', { name: /schedule post/i }));

    // Modal closes, post appears in the day cell
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(within(todayCell).getByText('New sponsored post')).toBeInTheDocument();
    expect(store.getState().posts.items).toHaveLength(1);
  });

  it('opens the edit modal when an existing event is clicked, and deletes it', () => {
    const todayKey = toDateKey(new Date());
    renderWithStore([
      {
        id: 'existing-1',
        title: 'Existing post',
        platform: 'Instagram',
        dateKey: todayKey,
        time: '09:00',
        status: 'draft',
        color: '#6b5ce7',
      },
    ]);

    fireEvent.click(screen.getByText('Existing post'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Existing post')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(screen.queryByText('Existing post')).not.toBeInTheDocument();
  });
});
