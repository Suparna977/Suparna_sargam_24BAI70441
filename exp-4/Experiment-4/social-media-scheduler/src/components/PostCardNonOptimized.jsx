import React from "react";
import { trackPostCard } from "./renderTracker";

function PostCardNonOptimized({ post, onDelete }) {

    // Track every render
    trackPostCard(post.id);

    console.log(
        "🔴 Non-Optimized: Rendering PostCard",
        post.id
    );

    return (
        <div className="post-card">

            <div className="post-card-header">

                <span className="platform">
                    {post.platform}
                </span>

                <button
                    className="delete-button"
                    onClick={() => onDelete(post.id)}
                >
                    ×
                </button>

            </div>

            <h3>{post.title}</h3>

            <p>
                📅 {post.date}
            </p>

            <p>
                ⏰ {post.time}
            </p>

        </div>
    );
}

export default PostCardNonOptimized;