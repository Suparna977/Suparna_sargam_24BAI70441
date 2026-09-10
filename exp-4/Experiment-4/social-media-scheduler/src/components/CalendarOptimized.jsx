import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useDispatch, useSelector } from "react-redux";

import { updatePostDate } from "../redux/postSlice";

import { trackCalendar } from "./renderTracker";


function CalendarOptimized() {

    const dispatch = useDispatch();

    const posts = useSelector(
        (state) => state.posts.posts
    );


    // ==========================================
    // TRACK CALENDAR RENDER
    // ==========================================

    useEffect(() => {

        trackCalendar();

    }, [posts]);


    // ==========================================
    // useMemo
    // ==========================================

    const events = useMemo(() => {

        console.log(
            "⚡ Optimized Calendar: useMemo calculating events"
        );

        return posts.map((post) => ({
            id: String(post.id),

            title: `${post.platform}: ${post.title}`,

            start: `${post.date}T${post.time}`,

            extendedProps: {
                platform: post.platform,
                postTitle: post.title,
            },
        }));

    }, [posts]);


    // ==========================================
    // DRAG & DROP
    // ==========================================

    const handleEventDrop = useCallback(
        (info) => {

            console.log(
                "🎯 Optimized Calendar: Drag & Drop"
            );

            const postId = info.event.id;

            const startDate = info.event.start;

            if (!startDate) {
                return;
            }

            const newDate =
                startDate.toISOString().split("T")[0];

            const newTime =
                startDate.toTimeString().slice(0, 5);


            console.log("Post ID:", postId);
            console.log("New Date:", newDate);
            console.log("New Time:", newTime);


            dispatch(
                updatePostDate({
                    id: postId,
                    date: newDate,
                    time: newTime,
                })
            );

        },
        [dispatch]
    );


    // ==========================================
    // EVENT CLICK
    // ==========================================

    const handleEventClick = useCallback(
        (info) => {

            alert(
                `📌 Post Details\n\n` +
                `Title: ${info.event.extendedProps.postTitle}\n` +
                `Platform: ${info.event.extendedProps.platform}\n` +
                `Date: ${info.event.start?.toLocaleString()}`
            );

        },
        []
    );


    return (

        <div className="calendar-container">

            {/* CALENDAR HEADER */}

            <div className="calendar-heading">

                <div>

                    <h2>
                        📅 Optimized Calendar
                    </h2>

                    <p>
                        React.memo • useCallback • useMemo • Drag & Drop
                    </p>

                </div>


                <div className="drag-badge">
                    ⚡ OPTIMIZED
                </div>

            </div>


            {/* FULL CALENDAR */}

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

                height="650px"

            />

        </div>
    );
}


export default CalendarOptimized;