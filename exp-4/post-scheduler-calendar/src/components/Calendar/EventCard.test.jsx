import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EventCard from './EventCard';

const post = {
  id: 'p1',
  title: 'Launch teaser',
  platform: 'Instagram',
  time: '14:30',
  status: 'scheduled',
  color: '#e1306c',
};

describe('EventCard', () => {
  it('renders the post title, formatted time, and status', () => {
    render(<EventCard post={post} onClick={() => {}} onDragStart={() => {}} />);
    expect(screen.getByText('Launch teaser')).toBeInTheDocument();
    expect(screen.getByText('2:30 PM')).toBeInTheDocument();
    expect(screen.getByText('scheduled')).toBeInTheDocument();
  });

  it('calls onClick with the post when clicked, without bubbling to parent', () => {
    const onClick = vi.fn();
    const parentClick = vi.fn();
    render(
      <div onClick={parentClick}>
        <EventCard post={post} onClick={onClick} onDragStart={() => {}} />
      </div>
    );
    fireEvent.click(screen.getByText('Launch teaser'));
    expect(onClick).toHaveBeenCalledWith(post);
    expect(parentClick).not.toHaveBeenCalled();
  });

  it('sets drag data on drag start', () => {
    const onDragStart = vi.fn();
    render(<EventCard post={post} onClick={() => {}} onDragStart={onDragStart} />);
    const card = screen.getByTitle(/Launch teaser/);
    fireEvent.dragStart(card);
    expect(onDragStart).toHaveBeenCalled();
  });
});
