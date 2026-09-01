import { describe, it, expect } from 'vitest';
import {
  buildMonthGrid,
  chunkIntoWeeks,
  toDateKey,
  formatMonthLabel,
  formatTimeLabel,
} from './dateUtils';

describe('buildMonthGrid', () => {
  it('always returns a multiple of 7 days (full weeks)', () => {
    const grid = buildMonthGrid(new Date(2026, 1, 15)); // Feb 2026
    expect(grid.length % 7).toBe(0);
  });

  it('marks days outside the target month as not current', () => {
    const grid = buildMonthGrid(new Date(2026, 1, 15));
    const outside = grid.filter((d) => !d.isCurrentMonth);
    const inside = grid.filter((d) => d.isCurrentMonth);
    expect(inside.length).toBe(28); // Feb 2026 is not a leap year
    expect(outside.length).toBe(grid.length - 28);
  });

  it('includes every day of the target month exactly once', () => {
    const grid = buildMonthGrid(new Date(2026, 3, 1)); // April 2026 (30 days)
    const aprilDays = grid.filter((d) => d.isCurrentMonth);
    expect(aprilDays.length).toBe(30);
    expect(new Set(aprilDays.map((d) => d.key)).size).toBe(30);
  });
});

describe('chunkIntoWeeks', () => {
  it('splits a flat array into groups of 7', () => {
    const days = Array.from({ length: 35 }, (_, i) => i);
    const weeks = chunkIntoWeeks(days);
    expect(weeks.length).toBe(5);
    weeks.forEach((w) => expect(w.length).toBe(7));
  });
});

describe('toDateKey', () => {
  it('formats a date as yyyy-MM-dd', () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('formatMonthLabel', () => {
  it('formats as "Month yyyy"', () => {
    expect(formatMonthLabel(new Date(2026, 8, 1))).toBe('September 2026');
  });
});

describe('formatTimeLabel', () => {
  it('converts 24h HH:mm to 12h with AM/PM', () => {
    expect(formatTimeLabel('00:00')).toBe('12:00 AM');
    expect(formatTimeLabel('09:05')).toBe('9:05 AM');
    expect(formatTimeLabel('13:30')).toBe('1:30 PM');
    expect(formatTimeLabel('23:59')).toBe('11:59 PM');
  });
});
