import React, { useMemo } from "react";
import { useSelector } from "react-redux";

function MonitoringPanel({ isOptimized }) {
    const posts = useSelector(
        (state) => state.posts.posts
    );

    const lastAction = useSelector(
        (state) => state.posts.lastAction
    );

    // Calculate statistics efficiently
    const statistics = useMemo(() => {
        console.log("⚡ useMemo: Calculating statistics");

        const total = posts.length;

        const linkedin = posts.filter(
            (post) => post.platform === "LinkedIn"
        ).length;

        const twitter = posts.filter(
            (post) => post.platform === "Twitter"
        ).length;

        const instagram = posts.filter(
            (post) => post.platform === "Instagram"
        ).length;

        return {
            total,
            linkedin,
            twitter,
            instagram,
        };
    }, [posts]);

    return (
        <section className="monitoring-panel">

            {/* =========================
          HEADER
      ========================= */}

            <div className="monitor-title">

                <div>
                    <h2>
                        ⚡ Performance Monitoring
                    </h2>

                    <p>
                        Application performance and optimization status
                    </p>
                </div>

                <span className="status">
                    {isOptimized
                        ? "● OPTIMIZED"
                        : "● NON-OPTIMIZED"}
                </span>

            </div>


            {/* =========================
          CURRENT MODE
      ========================= */}

            <div className="last-action">

                <span>
                    ⚙️ Current Performance Mode
                </span>

                <strong>
                    {isOptimized
                        ? "⚡ OPTIMIZED"
                        : "🔴 NON-OPTIMIZED"}
                </strong>

            </div>


            {/* =========================
          STATISTICS
      ========================= */}

            <div className="monitor-grid">

                <div className="monitor-card">
                    <span>📊 Total Posts</span>

                    <strong>
                        {statistics.total}
                    </strong>
                </div>


                <div className="monitor-card">
                    <span>💼 LinkedIn</span>

                    <strong>
                        {statistics.linkedin}
                    </strong>
                </div>


                <div className="monitor-card">
                    <span>🐦 Twitter</span>

                    <strong>
                        {statistics.twitter}
                    </strong>
                </div>


                <div className="monitor-card">
                    <span>📸 Instagram</span>

                    <strong>
                        {statistics.instagram}
                    </strong>
                </div>

            </div>


            {/* =========================
          OPTIMIZATION TECHNIQUES
      ========================= */}

            <div className="optimization-box">

                <h3>
                    🚀 Optimization Techniques
                </h3>

                <div className="optimization-list">

                    <div>
                        <span>
                            React.memo
                        </span>

                        <b>
                            {isOptimized
                                ? "✓ ACTIVE"
                                : "✗ INACTIVE"}
                        </b>
                    </div>


                    <div>
                        <span>
                            useMemo
                        </span>

                        <b>
                            {isOptimized
                                ? "✓ ACTIVE"
                                : "✗ INACTIVE"}
                        </b>
                    </div>


                    <div>
                        <span>
                            useCallback
                        </span>

                        <b>
                            {isOptimized
                                ? "✓ ACTIVE"
                                : "✗ INACTIVE"}
                        </b>
                    </div>


                    <div>
                        <span>
                            Redux State Management
                        </span>

                        <b>
                            ✓ ACTIVE
                        </b>
                    </div>

                </div>

            </div>


            {/* =========================
          EXPLANATION
      ========================= */}

            <div className="optimization-box">

                <h3>
                    💡 Why Optimized?
                </h3>

                {isOptimized ? (

                    <p>
                        React.memo prevents unnecessary component
                        re-renders, useMemo caches expensive
                        calculations, and useCallback keeps
                        function references stable.
                    </p>

                ) : (

                    <p>
                        Optimization techniques are disabled.
                        Components may re-render unnecessarily
                        and calculations may run again.
                    </p>

                )}

            </div>


            {/* =========================
          LAST ACTION
      ========================= */}

            <div className="last-action">

                <span>
                    🔄 Last Application Action
                </span>

                <strong>
                    {lastAction || "Application loaded"}
                </strong>

            </div>

        </section>
    );
}

export default MonitoringPanel;