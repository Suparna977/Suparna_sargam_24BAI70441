import { useState, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import DayCell from './DayCell';
import Toolbar from '../Toolbar/Toolbar';
import PostModal from '../Modal/PostModal';
import { usePostsByDate } from '../../hooks/usePostsByDate';
import {
  postAdded,
  postUpdated,
  postMoved,
  postDeleted,
} from '../../store/postsSlice';
import {
  buildMonthGrid,
  chunkIntoWeeks,
  addMonths,
  subMonths,
} from '../../utils/dateUtils';

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EMPTY_LIST = [];

export default function CalendarView() {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalState, setModalState] = useState(null); // { mode: 'create'|'edit', post?, dateKey? }

  const postsByDate = usePostsByDate();

  // useMemo: the grid only needs to be rebuilt when the visible month
  // changes, not on every re-render (e.g. when a post is added).
  const weeks = useMemo(() => {
    const days = buildMonthGrid(currentDate);
    return chunkIntoWeeks(days);
  }, [currentDate]);

  // useCallback: these handlers are passed down through DayCell -> EventCard.
  // Stable references let React.memo on those children actually skip
  // re-renders instead of always re-rendering because "the prop changed".
  const handlePrevMonth = useCallback(() => setCurrentDate((d) => subMonths(d, 1)), []);
  const handleNextMonth = useCallback(() => setCurrentDate((d) => addMonths(d, 1)), []);
  const handleToday = useCallback(() => setCurrentDate(new Date()), []);

  const handleDayClick = useCallback((day) => {
    setModalState({ mode: 'create', dateKey: day.key });
  }, []);

  const handleEventClick = useCallback((post) => {
    setModalState({ mode: 'edit', post });
  }, []);

  const handleNewPost = useCallback(() => {
    const todayKey = weeks.flat().find((d) => d.isToday)?.key ?? weeks[0][0].key;
    setModalState({ mode: 'create', dateKey: todayKey });
  }, [weeks]);

  const handleDropPost = useCallback(
    (postId, dateKey) => {
      dispatch(postMoved({ id: postId, dateKey }));
    },
    [dispatch]
  );

  const handleCloseModal = useCallback(() => setModalState(null), []);

  const handleSavePost = useCallback(
    (formData) => {
      if (formData.id) {
        dispatch(
          postUpdated({
            id: formData.id,
            changes: {
              title: formData.title,
              platform: formData.platform,
              time: formData.time,
              status: formData.status,
              color: formData.color,
            },
          })
        );
      } else {
        dispatch(postAdded(formData));
      }
      setModalState(null);
    },
    [dispatch]
  );

  const handleDeletePost = useCallback(
    (id) => {
      dispatch(postDeleted(id));
      setModalState(null);
    },
    [dispatch]
  );

  return (
    <div className="calendar-view">
      <Toolbar
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onNewPost={handleNewPost}
      />

      <div className="weekday-row">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="weekday-label">
            {label}
          </div>
        ))}
      </div>

      <div className="month-grid">
        {weeks.map((week, i) => (
          <div className="week-row" key={i}>
            {week.map((day) => (
              <DayCell
                key={day.key}
                day={day}
                posts={postsByDate[day.key] ?? EMPTY_LIST}
                onDayClick={handleDayClick}
                onEventClick={handleEventClick}
                onDropPost={handleDropPost}
              />
            ))}
          </div>
        ))}
      </div>

      {modalState && (
        <PostModal
          initialPost={modalState.mode === 'edit' ? modalState.post : null}
          dateKey={modalState.dateKey}
          onSave={handleSavePost}
          onDelete={handleDeletePost}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
