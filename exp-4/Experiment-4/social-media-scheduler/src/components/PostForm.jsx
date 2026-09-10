import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../redux/postSlice";

function PostForm() {
    const dispatch = useDispatch();

    // Form states
    const [title, setTitle] = useState("");
    const [platform, setPlatform] = useState("LinkedIn");
    const [date, setDate] = useState("2026-08-28");
    const [time, setTime] = useState("10:00");

    /*
     * useCallback
     *
     * Keeps the submit function stable
     * unless its dependencies change.
     */
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            // Validation
            if (!title.trim()) {
                alert("Please enter a post title.");
                return;
            }

            if (!date) {
                alert("Please select a date.");
                return;
            }

            if (!time) {
                alert("Please select a time.");
                return;
            }

            // Create new post
            const newPost = {
                id: Date.now().toString(),
                title: title.trim(),
                platform,
                date,
                time,
            };

            console.log("📅 Scheduling Post:", newPost);

            // Send post to Redux
            dispatch(addPost(newPost));

            console.log("✅ Post successfully added to Redux");

            // Success message
            alert("✅ Post scheduled successfully!");

            // Clear only title
            setTitle("");
        },
        [title, platform, date, time, dispatch]
    );

    return (
        <div className="form-container">

            <h2>➕ Schedule Post</h2>

            <form onSubmit={handleSubmit}>

                {/* POST TITLE */}
                <label>Post Title</label>

                <input
                    type="text"
                    placeholder="Enter post title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />


                {/* PLATFORM */}
                <label>Platform</label>

                <select
                    value={platform}
                    onChange={(e) =>
                        setPlatform(e.target.value)
                    }
                >
                    <option value="LinkedIn">
                        LinkedIn
                    </option>

                    <option value="Twitter">
                        Twitter
                    </option>

                    <option value="Instagram">
                        Instagram
                    </option>

                    <option value="Facebook">
                        Facebook
                    </option>
                </select>


                {/* DATE */}
                <label>Date</label>

                <input
                    type="date"
                    value={date}
                    onChange={(e) =>
                        setDate(e.target.value)
                    }
                />


                {/* TIME */}
                <label>Time</label>

                <input
                    type="time"
                    value={time}
                    onChange={(e) =>
                        setTime(e.target.value)
                    }
                />


                {/* SUBMIT */}
                <button type="submit">
                    📅 Schedule Post
                </button>

            </form>

        </div>
    );
}

export default PostForm;