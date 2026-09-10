import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useDispatch, useSelector } from "react-redux";
import { updatePostDate } from "../redux/postSlice";

function CalendarNonOptimized() {

    const dispatch = useDispatch();

    const posts = useSelector(
        (state) => state.posts.posts
    );

    // ❌ NO useMemo
    console.log("🔴 NON-OPTIMIZED: calculating events");

    const events = posts.map((post) => ({
        id: post.id,
        title: `${post.platform}: ${post.title}`,
        start: `${post.date}T${post.time}`,
        extendedProps: {
            platform: post.platform,
            postTitle: post.title,
        },
    }));

    // ❌ NO useCallback
    const handleEventDrop = (info) => {

        const postId = info.event.id;

        const newDate = info.event.start
            .toISOString()
            .split("T")[0];

        const newTime = info.event.start
            .toTimeString()
            .slice(0, 5);

        dispatch(
            updatePostDate({
                id: postId,
                date: newDate,
                time: newTime,
            })
        );
    };

    const handleEventClick = (info) => {
        alert(
            `Post Details\n\nTitle: ${info.event.extendedProps.postTitle}`
        );
    };

    return (
        <div className="calendar-container">

            <div className="calendar-heading">

                <div>
                    <h2>📅 Non-Optimized Calendar</h2>

                    <p>
                        No memoization techniques used
                    </p>
                </div>

                <div className="drag-badge">
                    🔴 NON-OPTIMIZED
                </div>

            </div>

            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                ]}

                initialView="dayGridMonth"

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

                height="650px"
            />

        </div>
    );
}

export default CalendarNonOptimized;