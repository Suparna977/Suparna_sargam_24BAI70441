import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useDispatch, useSelector } from "react-redux";

import { updatePostDate } from "../redux/postSlice";

function Calendar() {
    const dispatch = useDispatch();

    // ==============================
    // REDUX POSTS
    // ==============================

    const posts = useSelector(
        (state) => state.posts.posts
    );

    // ==============================
    // OPTIMIZATION SWITCHES
    // ==============================

    const [memoEnabled, setMemoEnabled] =
        useState(true);

    const [callbackEnabled, setCallbackEnabled] =
        useState(true);

    const [memoFilterEnabled, setMemoFilterEnabled] =
        useState(true);

    const [liveClockEnabled, setLiveClockEnabled] =
        useState(false);

    // ==============================
    // RENDER COUNTER
    // ==============================

    const [renderCount, setRenderCount] =
        useState(0);

    const [cardRenders, setCardRenders] =
        useState({});

    // Count Calendar renders
    useEffect(() => {
        setRenderCount((count) => count + 1);
    }, [posts]);

    // ==============================
    // LIVE CLOCK
    // ==============================

    const [currentTime, setCurrentTime] =
        useState(new Date());

    useEffect(() => {
        if (!liveClockEnabled) return;

        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 450);

        return () => clearInterval(interval);
    }, [liveClockEnabled]);

    // ==============================
    // NORMAL EVENT CREATION
    // ==============================

    const createEvents = () => {
        console.log(
            "🔴 Non-Optimized: Calculating events"
        );

        return posts.map((post) => ({
            id: post.id,

            title: `${post.platform}: ${post.title}`,

            start: `${post.date}T${post.time}`,

            extendedProps: {
                platform: post.platform,
                postTitle: post.title,
            },
        }));
    };

    // ==============================
    // useMemo OPTIMIZATION
    // ==============================

    const memoizedEvents = useMemo(() => {
        console.log(
            "⚡ useMemo: Calculating calendar events"
        );

        return posts.map((post) => ({
            id: post.id,

            title: `${post.platform}: ${post.title}`,

            start: `${post.date}T${post.time}`,

            extendedProps: {
                platform: post.platform,
                postTitle: post.title,
            },
        }));
    }, [posts]);

    // Choose optimized or non-optimized events
    const events = memoFilterEnabled
        ? memoizedEvents
        : createEvents();

    // ==============================
    // DRAG & DROP HANDLER
    // ==============================

    const optimizedEventDrop = useCallback(
        (info) => {
            console.log(
                "⚡ useCallback: Drag handler reused"
            );

            const postId = info.event.id;

            const date = info.event.start
                .toISOString()
                .split("T")[0];

            const time = info.event.start
                .toTimeString()
                .slice(0, 5);

            dispatch(
                updatePostDate({
                    id: postId,
                    date,
                    time,
                })
            );
        },
        [dispatch]
    );

    // Non-optimized handler
    const nonOptimizedEventDrop = (info) => {
        console.log(
            "🔴 Non-Optimized: New drag handler created"
        );

        const postId = info.event.id;

        const date = info.event.start
            .toISOString()
            .split("T")[0];

        const time = info.event.start
            .toTimeString()
            .slice(0, 5);

        dispatch(
            updatePostDate({
                id: postId,
                date,
                time,
            })
        );
    };

    const handleEventDrop = callbackEnabled
        ? optimizedEventDrop
        : nonOptimizedEventDrop;

    // ==============================
    // EVENT CLICK
    // ==============================

    const handleEventClick = useCallback(
        (info) => {
            alert(
                `📌 Post Details\n\n` +
                `Title: ${info.event.extendedProps.postTitle}\n` +
                `Platform: ${info.event.extendedProps.platform}\n` +
                `Date: ${info.event.start.toLocaleString()}`
            );
        },
        []
    );

    // ==============================
    // RESET COUNTERS
    // ==============================

    const resetCounters = () => {
        setRenderCount(0);
        setCardRenders({});
    };

    // ==============================
    // CARD RENDER MONITOR
    // ==============================

    const handleEventDidMount = (info) => {
        const id = info.event.id;

        setCardRenders((previous) => ({
            ...previous,
            [id]: (previous[id] || 0) + 1,
        }));
    };

    // ==============================
    // TOTAL CARD RENDERS
    // ==============================

    const totalCardRenders = Object.values(
        cardRenders
    ).reduce(
        (total, value) => total + value,
        0
    );

    // ==============================
    // RETURN UI
    // ==============================

    return (
        <div className="calendar-page">

            {/* =================================
          UPPER OPTIMIZATION CONTROLS
      ================================= */}

            <section className="optimization-controls">

                <div className="control-item">

                    <div className="switch-row">

                        <button
                            className={
                                memoEnabled
                                    ? "mini-toggle active"
                                    : "mini-toggle"
                            }
                            onClick={() =>
                                setMemoEnabled(!memoEnabled)
                            }
                        >
                            <span />
                        </button>

                        <strong>
                            React.memo on cards
                        </strong>

                    </div>

                    <p>
                        Skip a card's re-render when its
                        own props haven't changed.
                    </p>

                </div>

                <div className="control-item">

                    <div className="switch-row">

                        <button
                            className={
                                callbackEnabled
                                    ? "mini-toggle active"
                                    : "mini-toggle"
                            }
                            onClick={() =>
                                setCallbackEnabled(
                                    !callbackEnabled
                                )
                            }
                        >
                            <span />
                        </button>

                        <strong>
                            useCallback for handlers
                        </strong>

                    </div>

                    <p>
                        Keep drag handlers referentially
                        stable.
                    </p>

                </div>

                <div className="control-item">

                    <div className="switch-row">

                        <button
                            className={
                                memoFilterEnabled
                                    ? "mini-toggle active"
                                    : "mini-toggle"
                            }
                            onClick={() =>
                                setMemoFilterEnabled(
                                    !memoFilterEnabled
                                )
                            }
                        >
                            <span />
                        </button>

                        <strong>
                            useMemo for calendar events
                        </strong>

                    </div>

                    <p>
                        Cache the event list and recompute
                        only when posts change.
                    </p>

                </div>

                <div className="clock-row">

                    <div>

                        <div className="switch-row">

                            <button
                                className={
                                    liveClockEnabled
                                        ? "mini-toggle active"
                                        : "mini-toggle"
                                }
                                onClick={() =>
                                    setLiveClockEnabled(
                                        !liveClockEnabled
                                    )
                                }
                            >
                                <span />
                            </button>

                            <strong>
                                Live clock
                            </strong>

                        </div>

                        <p>
                            Ticks every 450ms to simulate
                            unrelated state changes.
                        </p>

                    </div>

                    <button
                        className="reset-button"
                        onClick={resetCounters}
                    >
                        Reset counters
                    </button>

                </div>

            </section>

            {/* =================================
          MAIN CALENDAR + SIDE MONITOR
      ================================= */}

            <div className="calendar-monitor-layout">

                {/* CALENDAR */}

                <section className="calendar-container">

                    <div className="calendar-heading">

                        <div>

                            <h2>
                                📅 Content Calendar
                            </h2>

                            <p>
                                Drag any post to another date
                                to reschedule it.
                            </p>

                        </div>

                        <div className="drag-badge">
                            🖱️ DRAG & DROP ENABLED
                        </div>

                    </div>

                    {/* LIVE CLOCK */}

                    {liveClockEnabled && (
                        <div className="live-clock">
                            🕐 Live Time:{" "}
                            {currentTime.toLocaleTimeString()}
                        </div>
                    )}

                    <FullCalendar

                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                        ]}

                        initialView="dayGridMonth"

                        initialDate="2026-08-15"

                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right:
                                "dayGridMonth,timeGridWeek,timeGridDay",
                        }}

                        events={events}

                        editable={true}

                        droppable={true}

                        eventDrop={handleEventDrop}

                        eventClick={handleEventClick}

                        eventDidMount={
                            memoEnabled
                                ? handleEventDidMount
                                : undefined
                        }

                        height="650px"

                    />

                </section>

                {/* =================================
            RIGHT RENDER MONITOR
        ================================= */}

                <aside className="calendar-render-monitor">

                    <h2>
                        📊 RENDER MONITOR
                    </h2>

                    <div className="render-statistics">

                        <div>

                            <strong>
                                {renderCount}
                            </strong>

                            <span>
                                total renders logged
                            </span>

                        </div>

                        <div>

                            <strong>
                                {totalCardRenders}
                            </strong>

                            <span>
                                calendar events rendered
                            </span>

                        </div>

                    </div>

                    <div className="render-list">

                        {posts.length === 0 ? (

                            <p>
                                No scheduled posts
                            </p>

                        ) : (

                            posts.map((post) => (

                                <div
                                    className="render-item"
                                    key={post.id}
                                >

                                    <span>
                                        {post.title}
                                    </span>

                                    <div className="render-bar">

                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    (cardRenders[post.id] ||
                                                        0) * 20,
                                                    100
                                                )}%`,
                                            }}
                                        />

                                    </div>

                                    <strong>
                                        {cardRenders[post.id] || 0}
                                    </strong>

                                </div>

                            ))

                        )}

                    </div>

                    <div className="monitor-message">

                        {memoEnabled ? (
                            <>
                                ⚡ React.memo is{" "}
                                <strong>ON</strong> — cards
                                avoid unnecessary re-renders.
                            </>
                        ) : (
                            <>
                                🔴 React.memo is{" "}
                                <strong>OFF</strong> — cards
                                can re-render unnecessarily.
                            </>
                        )}

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default Calendar;