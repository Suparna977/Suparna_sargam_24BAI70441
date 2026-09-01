import { memo } from 'react';
import { formatTimeLabel } from '../../utils/dateUtils';

/**
 * Renders a single scheduled post as a small draggable pill.
 *
 * Wrapped in React.memo: a day cell may render many EventCards, and
 * without memo every one of them would re-render whenever ANY post in
 * the whole app changed (because the parent DayCell re-renders). memo
 * ensures a card only re-renders when its own `post` prop, or the
 * callbacks passed to it, actually change.
 */
function EventCard({ post, onClick, onDragStart }) {
  return (
    <div
      className="event-card"
      style={{ borderLeftColor: post.color }}
      draggable
      onDragStart={(e) => onDragStart(e, post)}
      onClick={(e) => {
        e.stopPropagation();
        onClick(post);
      }}
      title={`${post.title} · ${post.platform} · ${formatTimeLabel(post.time)}`}
    >
      <span className="event-time">{formatTimeLabel(post.time)}</span>
      <span className="event-title">{post.title}</span>
      <span className={`event-status status-${post.status}`}>{post.status}</span>
    </div>
  );
}

function propsAreEqual(prev, next) {
  return (
    prev.post === next.post &&
    prev.onClick === next.onClick &&
    prev.onDragStart === next.onDragStart
  );
}

export default memo(EventCard, propsAreEqual);
