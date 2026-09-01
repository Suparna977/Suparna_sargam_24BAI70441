import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday as dfIsToday,
  addMonths,
  subMonths,
} from 'date-fns';

/**
 * Builds a full 6-week (42 day) grid for the month containing `date`.
 * This is the core "temporal data modeling" step: it converts a single
 * JS Date into a flat array of day objects the UI can map over.
 */
export function buildMonthGrid(date) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return days.map((day) => ({
    date: day,
    key: format(day, 'yyyy-MM-dd'),
    isCurrentMonth: isSameMonth(day, date),
    isToday: dfIsToday(day),
  }));
}

/** Splits a flat array of days into week-length (7) chunks for row rendering. */
export function chunkIntoWeeks(days, size = 7) {
  const weeks = [];
  for (let i = 0; i < days.length; i += size) {
    weeks.push(days.slice(i, i + size));
  }
  return weeks;
}

export function toDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

export function isSameDayKey(date, key) {
  return toDateKey(date) === key;
}

export { isSameDay, addMonths, subMonths, format };

export function formatMonthLabel(date) {
  return format(date, 'MMMM yyyy');
}

export function formatTimeLabel(timeString) {
  // timeString is "HH:mm" in 24h format
  const [h, m] = timeString.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}
