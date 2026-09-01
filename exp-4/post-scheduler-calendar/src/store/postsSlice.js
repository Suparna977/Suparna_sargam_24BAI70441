import { createSlice, nanoid } from '@reduxjs/toolkit';
import { toDateKey } from '../utils/dateUtils';

const today = new Date();

const seedPosts = [
  {
    id: nanoid(),
    title: 'Product teaser reel',
    platform: 'Instagram',
    dateKey: toDateKey(today),
    time: '10:00',
    status: 'scheduled',
    color: '#e1306c',
  },
  {
    id: nanoid(),
    title: 'Weekly newsletter',
    platform: 'Twitter/X',
    dateKey: toDateKey(today),
    time: '15:30',
    status: 'draft',
    color: '#1d9bf0',
  },
  {
    id: nanoid(),
    title: 'Behind the scenes video',
    platform: 'LinkedIn',
    dateKey: toDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)),
    time: '09:00',
    status: 'scheduled',
    color: '#0a66c2',
  },
];

const initialState = {
  items: seedPosts,
  selectedPostId: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare({ title, platform, dateKey, time, status, color }) {
        return {
          payload: {
            id: nanoid(),
            title,
            platform,
            dateKey,
            time,
            status: status || 'draft',
            color: color || '#6b5ce7',
          },
        };
      },
    },
    postUpdated(state, action) {
      const { id, changes } = action.payload;
      const post = state.items.find((p) => p.id === id);
      if (post) Object.assign(post, changes);
    },
    postMoved(state, action) {
      // Used by drag-and-drop: relocate a post to a new date (and optionally time)
      const { id, dateKey, time } = action.payload;
      const post = state.items.find((p) => p.id === id);
      if (post) {
        post.dateKey = dateKey;
        if (time) post.time = time;
      }
    },
    postDeleted(state, action) {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
    postSelected(state, action) {
      state.selectedPostId = action.payload;
    },
  },
});

export const { postAdded, postUpdated, postMoved, postDeleted, postSelected } =
  postsSlice.actions;

// Selectors
export const selectAllPosts = (state) => state.posts.items;
export const selectSelectedPostId = (state) => state.posts.selectedPostId;
export const selectPostById = (state, id) =>
  state.posts.items.find((p) => p.id === id);

export default postsSlice.reducer;
