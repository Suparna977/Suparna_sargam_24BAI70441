import { memo } from 'react';
import { formatMonthLabel } from '../../utils/dateUtils';

function Toolbar({ currentDate, onPrevMonth, onNextMonth, onToday, onNewPost }) {
  return (
    <div className="toolbar">
      <div className="toolbar__nav">
        <button onClick={onPrevMonth} aria-label="Previous month">
          &lsaquo;
        </button>
        <h2 className="toolbar__label">{formatMonthLabel(currentDate)}</h2>
        <button onClick={onNextMonth} aria-label="Next month">
          &rsaquo;
        </button>
        <button className="toolbar__today" onClick={onToday}>
          Today
        </button>
      </div>
      <button className="toolbar__new-post" onClick={onNewPost}>
        + New Post
      </button>
    </div>
  );
}

export default memo(Toolbar);
