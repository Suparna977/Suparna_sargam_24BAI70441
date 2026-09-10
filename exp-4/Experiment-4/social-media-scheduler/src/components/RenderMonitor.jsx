import React, {
    useEffect,
    useState,
} from "react";

import {
    getRenderStats,
    subscribeToRenderStats,
} from "./renderTracker";

function RenderMonitor() {

    const [stats, setStats] = useState(
        getRenderStats()
    );

    useEffect(() => {

        const unsubscribe =
            subscribeToRenderStats((newStats) => {
                setStats({
                    ...newStats,
                    postCards: {
                        ...newStats.postCards,
                    },
                });
            });

        return unsubscribe;

    }, []);

    const postCardEntries = Object.entries(
        stats.postCards
    );

    return (
        <section className="render-monitor">

            <div>

                <h3>
                    🔍 Render Monitor
                </h3>

                <p>
                    Tracks component rendering
                </p>

            </div>

            <div className="render-count">
                {stats.totalRenders}
            </div>

            <div>

                <span>
                    total renders
                </span>

            </div>

            <div className="render-details">

                <strong>
                    Post Cards
                </strong>

                {postCardEntries.length === 0 ? (

                    <p>
                        No post renders yet
                    </p>

                ) : (

                    postCardEntries.map(
                        ([id, count]) => (

                            <div
                                key={id}
                                className="render-row"
                            >

                                <span>
                                    Post {id}
                                </span>

                                <strong>
                                    {count}
                                </strong>

                            </div>

                        )
                    )

                )}

            </div>

        </section>
    );
}

export default RenderMonitor;