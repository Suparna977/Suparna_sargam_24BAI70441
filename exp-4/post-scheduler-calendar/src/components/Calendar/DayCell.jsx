import { memo, useState } from 'react';
import { format } from 'date-fns';
import EventCard from './EventCard';

/**
 * A single day cell in the month grid.
 *
 * React.memo here matters a lot: a month grid has up to 42 cells. If a
 * user edits/moves ONE post, we only want the 1-2 cells whose post
 * lists actually changed to re-render, not all 42. The `posts` array
 * reference for a given day only changes when that specific day's
 * posts change (see usePostsByDate), so memo correctly skips the rest.
 */
function DayCell({ day, posts, onDayClick, onEventClick, onDropPost }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const postId = e.dataTransfer.getData('text/plain');
    if (postId) onDropPost(postId, day.key);
  };

  const handleDragStart = (e, post) => {
    e.dataTransfer.setData('text/plain', post.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={[
        'day-cell',
        day.isCurrentMonth ? '' : 'day-cell--muted',
        day.isToday ? 'day-cell--today' : '',
        isDragOver ? 'day-cell--drag-over' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onDayClick(day)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid={`day-cell-${day.key}`}
    >
      <div className="day-cell__header">{format(day.date, 'd')}</div>
      <div className="day-cell__events">
        {posts.map((post) => (
          <EventCard
            key={post.id}
            post={post}
            onClick={onEventClick}
            onDragStart={handleDragStart}
          />
        ))}
      </div>
    </div>
  );
}

function propsAreEqual(prev, next) {
  return (
    prev.day.key === next.day.key &&
    prev.day.isCurrentMonth === next.day.isCurrentMonth &&
    prev.day.isToday === next.day.isToday &&
    prev.posts === next.posts &&
    prev.onDayClick === next.onDayClick &&
    prev.onEventClick === next.onEventClick &&
    prev.onDropPost === next.onDropPost
  );
}

export default memo(DayCell, propsAreEqual);
