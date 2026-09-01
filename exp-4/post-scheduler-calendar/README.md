# Post Scheduler — Interactive Calendar (Lab Experiment)

An interactive calendar interface for scheduling and managing social-media
posts, built with **React + Redux Toolkit**, featuring drag-and-drop
rescheduling, memoized rendering, and a Vitest/React Testing Library test
suite.

This project implements both experiments from the lab sheet:

1. **Interactive calendar for scheduling posts** (CO3‑BT3)
2. **Rendering performance optimization + testing** (CO4‑BT4, CO5‑BT5)

---

## 1. Features

- **Month view** calendar grid built from scratch (no external calendar
  library) so every step of the temporal-data-modeling pipeline is visible
  in the code: `buildMonthGrid` → `chunkIntoWeeks` → render.
- **Event mapping**: posts (Redux state) are grouped by `dateKey` and
  rendered into the matching day cell.
- **Click interactions**: click an empty day to create a post, click an
  existing post to edit or delete it.
- **Drag-and-drop scheduling**: drag any post card onto another day to
  reschedule it (native HTML5 Drag and Drop API — no extra dependency).
- **Redux Toolkit** store (`postsSlice`) holding all posts, with
  `postAdded` / `postUpdated` / `postMoved` / `postDeleted` reducers.
- **Rendering performance**:
  - `React.memo` on `DayCell` and `EventCard` with custom comparators, so
    editing one post only re-renders that post's card and day cell —
    not all 42 cells in the grid.
  - `useMemo` for the month grid computation and for the
    posts-grouped-by-date derived state (`usePostsByDate`).
  - `useCallback` for every handler passed down to memoized children, so
    memo comparisons actually succeed instead of failing on a new
    function reference every render.
- **Tests** (Vitest + React Testing Library — a modern, Jest-API-compatible
  stack that pairs natively with Vite):
  - Pure logic: date utilities, Redux reducers/selectors, the
    `usePostsByDate` memoized hook (including a reference-equality test
    proving memoization works).
  - Component behavior: `EventCard` rendering/click/drag, `DayCell`
    click-to-create and drop-to-reschedule.
  - Integration: full `CalendarView` flow — open modal, create a post,
    see it appear on the grid; open an existing post and delete it.

## 2. Project structure

```
post-scheduler-calendar/
├─ src/
│  ├─ components/
│  │  ├─ Calendar/
│  │  │  ├─ CalendarView.jsx      # top-level view, wires state + grid
│  │  │  ├─ CalendarView.test.jsx
│  │  │  ├─ DayCell.jsx           # memoized day cell / drop target
│  │  │  ├─ DayCell.test.jsx
│  │  │  ├─ EventCard.jsx         # memoized draggable post card
│  │  │  └─ EventCard.test.jsx
│  │  ├─ Modal/
│  │  │  └─ PostModal.jsx         # create/edit/delete form
│  │  └─ Toolbar/
│  │     └─ Toolbar.jsx           # month navigation, "New Post"
│  ├─ hooks/
│  │  ├─ usePostsByDate.js        # useMemo-based grouping selector hook
│  │  └─ usePostsByDate.test.jsx
│  ├─ store/
│  │  ├─ store.js                 # configureStore
│  │  ├─ postsSlice.js            # Redux Toolkit slice (CRUD + move)
│  │  └─ postsSlice.test.js
│  ├─ utils/
│  │  ├─ dateUtils.js             # month grid + formatting helpers
│  │  └─ dateUtils.test.js
│  ├─ test/setup.js               # jest-dom matchers for Vitest
│  ├─ App.jsx / App.css
│  ├─ main.jsx                    # Redux <Provider> + React root
│  └─ index.css
├─ vite.config.js                 # includes `test` block for Vitest
└─ package.json
```

## 3. Running the project

```bash
npm install
npm run dev        # start dev server (Vite)
npm run build       # production build
npm run test        # run the full Vitest suite once
npm run test:watch  # run tests in watch mode
```

## 4. Implementation notes (for viva / write-up)

**Temporal data modeling.** `buildMonthGrid(date)` uses `date-fns` to
compute the first/last visible day of a month view (including the
leading/trailing days from adjacent months needed to fill full weeks),
then returns a flat array of `{ date, key, isCurrentMonth, isToday }`
objects. `chunkIntoWeeks` reshapes that flat array into week-length rows
for the grid layout — a direct example of mapping structured temporal
data onto a 2D UI layout.

**Event mapping.** Posts are stored as a flat array in Redux, each with a
`dateKey` (`yyyy-MM-dd`). `usePostsByDate` groups them into a
`{ [dateKey]: Post[] }` map with `useMemo`, so `CalendarView` can hand
each `DayCell` exactly the posts for that day.

**Drag-and-drop.** Each `EventCard` is `draggable` and puts its post `id`
into `dataTransfer` on `dragstart`. Each `DayCell` listens for
`dragover`/`drop`; on drop it reads the id back out and dispatches
`postMoved({ id, dateKey })`, which updates that post's `dateKey` in the
Redux store. The grid re-renders only the two affected cells thanks to
memoization.

**Why memoization matters here, concretely.** With 42 day cells each
potentially rendering several event cards, a naive implementation
re-renders the entire grid (potentially 100+ components) on every state
change — even something as small as opening the "new post" modal.
`React.memo` + stable `useCallback` handlers + `useMemo`-derived data cut
this down so only the components whose actual props changed re-render.
This can be verified in DevTools' React Profiler by toggling "Highlight
updates when components render" and comparing renders before/after
removing the `memo` wrappers.

**Testing strategy.** Tests are split into three tiers, matching standard
front-end testing practice:
1. **Unit** — pure functions (`dateUtils`) and reducers (`postsSlice`)
   tested with no rendering at all.
2. **Component** — `EventCard` and `DayCell` tested in isolation with
   React Testing Library, asserting on rendered output and simulated
   `click`/`dragstart`/`dragover`/`drop` events.
3. **Integration** — `CalendarView` rendered with a real Redux store,
   exercising the full create → render → edit → delete flow the way a
   user actually would.

## 5. Possible extensions

- Week/day views in addition to month view.
- Resize handles on events to edit duration, not just a fixed time.
- Persisting posts to a backend (this experiment keeps everything in
  client-side Redux state for simplicity).
- Optimistic UI + undo for drag-and-drop moves.
