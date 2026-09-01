import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DayCell from './DayCell';

const day = {
  date: new Date(2026, 8, 15),
  key: '2026-09-15',
  isCurrentMonth: true,
  isToday: false,
};

const posts = [
  { id: 'p1', title: 'Post A', platform: 'Instagram', time: '09:00', status: 'draft', color: '#6b5ce7' },
];

describe('DayCell', () => {
  it('renders the day number and its posts', () => {
    render(
      <DayCell day={day} posts={posts} onDayClick={() => {}} onEventClick={() => {}} onDropPost={() => {}} />
    );
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Post A')).toBeInTheDocument();
  });

  it('fires onDayClick when the empty cell area is clicked', () => {
    const onDayClick = vi.fn();
    render(
      <DayCell day={day} posts={[]} onDayClick={onDayClick} onEventClick={() => {}} onDropPost={() => {}} />
    );
    fireEvent.click(screen.getByTestId('day-cell-2026-09-15'));
    expect(onDayClick).toHaveBeenCalledWith(day);
  });

  it('calls onDropPost with the dragged post id and this day key on drop', () => {
    const onDropPost = vi.fn();
    render(
      <DayCell day={day} posts={[]} onDayClick={() => {}} onEventClick={() => {}} onDropPost={onDropPost} />
    );
    const cell = screen.getByTestId('day-cell-2026-09-15');

    const dataTransfer = {
      data: {},
      getData(type) {
        return this.data[type];
      },
      setData(type, value) {
        this.data[type] = value;
      },
    };
    dataTransfer.setData('text/plain', 'post-42');

    fireEvent.dragOver(cell, { dataTransfer });
    fireEvent.drop(cell, { dataTransfer });

    expect(onDropPost).toHaveBeenCalledWith('post-42', '2026-09-15');
  });
});
