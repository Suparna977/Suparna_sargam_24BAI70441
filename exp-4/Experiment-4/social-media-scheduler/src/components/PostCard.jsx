import React from "react";

const PostCard = React.memo(function PostCard({
    post,
    onDelete,
}) {

    console.log(
        "🟢 OPTIMIZED: Rendering PostCard",
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
});

export default PostCard;