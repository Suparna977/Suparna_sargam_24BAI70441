import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllPosts } from '../store/postsSlice';

/**
 * Groups the flat posts array into a { [dateKey]: Post[] } map.
 *
 * Why useMemo matters here: without it, every render of the calendar
 * (e.g. caused by an unrelated state change like opening a modal)
 * would re-run this O(n) grouping pass. Memoizing on `posts` means the
 * grouping only recomputes when the underlying posts array actually
 * changes reference (i.e. a real add/edit/move/delete).
 */
export function usePostsByDate() {
  const posts = useSelector(selectAllPosts);

  return useMemo(() => {
    const map = {};
    for (const post of posts) {
      if (!map[post.dateKey]) map[post.dateKey] = [];
      map[post.dateKey].push(post);
    }
    // Keep each day's posts sorted by time so rendering order is stable.
    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [posts]);
}
