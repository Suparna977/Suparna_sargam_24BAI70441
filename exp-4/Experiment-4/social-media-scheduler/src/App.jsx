import React, {
  lazy,
  Suspense,
  useCallback,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import PostForm from "./components/PostForm";

import PostCard from "./components/PostCard";
import PostCardNonOptimized from "./components/PostCardNonOptimized";

import MonitoringPanel from "./components/MonitoringPanel";
import RenderMonitor from "./components/RenderMonitor";

import {
  deletePost,
} from "./redux/postSlice";

import {
  resetRenderStats,
} from "./components/renderTracker";

import "./App.css";

// Lazy loading
const CalendarOptimized = lazy(
  () => import("./components/CalendarOptimized")
);

const CalendarNonOptimized = lazy(
  () => import("./components/CalendarNonOptimized")
);

function App() {

  const dispatch = useDispatch();

  const posts = useSelector(
    (state) => state.posts.posts
  );

  const [isOptimized, setIsOptimized] =
    useState(true);

  // Delete post
  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePost(id));
    },
    [dispatch]
  );

  // Toggle optimization
  const handleToggle = () => {

    setIsOptimized((previous) => !previous);

    // Reset render counters
    resetRenderStats();
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">

        <div>

          <h1>
            📅 Social Media Scheduler
          </h1>

          <p>
            Schedule • Drag • Optimize • Monitor
          </p>

        </div>

      </header>


      <main>

        {/* ================= OPTIMIZATION CONTROLS ================= */}

        <section className="optimization-toggle">

          <h2>
            ⚙️ Performance Optimization
          </h2>

          <p>
            Compare optimized and non-optimized rendering
          </p>


          <div className="toggle-container">

            <span>
              🔴 Non-Optimized
            </span>


            <button
              className={
                isOptimized
                  ? "toggle active"
                  : "toggle"
              }
              onClick={handleToggle}
            >

              <span className="toggle-circle">

                {isOptimized
                  ? "✓"
                  : "×"}

              </span>

            </button>


            <span>
              ⚡ Optimized
            </span>

          </div>


          <div className="mode-display">

            Current Mode:

            <strong>

              {isOptimized
                ? " ⚡ OPTIMIZED"
                : " 🔴 NON-OPTIMIZED"}

            </strong>

          </div>

        </section>


        {/* ================= POST SECTION ================= */}

        <section className="top-section">


          {/* POST FORM */}

          <PostForm />


          {/* POST LIST */}

          <div className="post-list">

            <div className="section-title">

              <div>

                <h2>
                  📝 Scheduled Posts
                </h2>

                <p>
                  {posts.length} posts scheduled
                </p>

              </div>

            </div>


            {posts.map((post) => (

              isOptimized ? (

                <PostCard
                  key={post.id}
                  post={post}
                  onDelete={handleDelete}
                />

              ) : (

                <PostCardNonOptimized
                  key={post.id}
                  post={post}
                  onDelete={handleDelete}
                />

              )

            ))}

          </div>

        </section>


        {/* ================= CALENDAR ================= */}

        <Suspense
          fallback={
            <div className="loading">
              Loading Calendar...
            </div>
          }
        >

          {isOptimized ? (

            <CalendarOptimized />

          ) : (

            <CalendarNonOptimized />

          )}

        </Suspense>


        {/* ================= RENDER MONITOR ================= */}

        <RenderMonitor />


        {/* ================= PERFORMANCE PANEL ================= */}

        <MonitoringPanel
          isOptimized={isOptimized}
        />


      </main>


      {/* ================= FOOTER ================= */}

      <footer>

        <p>
          Interactive Calendar • Drag & Drop •
          React Optimization • Performance Monitoring
        </p>

      </footer>

    </div>
  );
}

export default App;