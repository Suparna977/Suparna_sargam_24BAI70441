import { describe, it, expect } from 'vitest';
import reducer, {
  postAdded,
  postUpdated,
  postMoved,
  postDeleted,
  postSelected,
} from './postsSlice';

const baseState = { items: [], selectedPostId: null };

describe('postsSlice reducer', () => {
  it('adds a new post with a generated id and default status/color', () => {
    const state = reducer(
      baseState,
      postAdded({ title: 'Launch post', platform: 'Instagram', dateKey: '2026-09-10', time: '10:00' })
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      title: 'Launch post',
      platform: 'Instagram',
      dateKey: '2026-09-10',
      time: '10:00',
      status: 'draft',
    });
    expect(state.items[0].id).toBeTruthy();
  });

  it('updates an existing post by id', () => {
    const withPost = reducer(
      baseState,
      postAdded({ title: 'Draft', platform: 'LinkedIn', dateKey: '2026-09-10', time: '09:00' })
    );
    const id = withPost.items[0].id;
    const updated = reducer(withPost, postUpdated({ id, changes: { status: 'published' } }));
    expect(updated.items[0].status).toBe('published');
    expect(updated.items[0].title).toBe('Draft'); // untouched fields remain
  });

  it('moves a post to a new date (drag-and-drop)', () => {
    const withPost = reducer(
      baseState,
      postAdded({ title: 'Reel', platform: 'Instagram', dateKey: '2026-09-10', time: '09:00' })
    );
    const id = withPost.items[0].id;
    const moved = reducer(withPost, postMoved({ id, dateKey: '2026-09-15' }));
    expect(moved.items[0].dateKey).toBe('2026-09-15');
  });

  it('does not affect other posts when moving one post', () => {
    let state = reducer(
      baseState,
      postAdded({ title: 'A', platform: 'Instagram', dateKey: '2026-09-10', time: '09:00' })
    );
    state = reducer(
      state,
      postAdded({ title: 'B', platform: 'Instagram', dateKey: '2026-09-11', time: '09:00' })
    );
    const idA = state.items[0].id;
    const moved = reducer(state, postMoved({ id: idA, dateKey: '2026-09-20' }));
    expect(moved.items[0].dateKey).toBe('2026-09-20');
    expect(moved.items[1].dateKey).toBe('2026-09-11');
  });

  it('deletes a post by id', () => {
    const withPost = reducer(
      baseState,
      postAdded({ title: 'Temp', platform: 'Instagram', dateKey: '2026-09-10', time: '09:00' })
    );
    const id = withPost.items[0].id;
    const afterDelete = reducer(withPost, postDeleted(id));
    expect(afterDelete.items).toHaveLength(0);
  });

  it('tracks the selected post id', () => {
    const state = reducer(baseState, postSelected('abc-123'));
    expect(state.selectedPostId).toBe('abc-123');
  });
});
