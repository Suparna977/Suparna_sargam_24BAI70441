import React, {
    useEffect,
    useState,
} from "react";

function OptimizationControls({
    memoEnabled,
    setMemoEnabled,

    callbackEnabled,
    setCallbackEnabled,

    memoCalculationEnabled,
    setMemoCalculationEnabled,

    liveClock,
    setLiveClock,

    onReset,
}) {

    const [time, setTime] = useState(
        new Date()
    );

    useEffect(() => {

        if (!liveClock) {
            return;
        }

        const interval = setInterval(() => {

            setTime(new Date());

        }, 1000);

        return () => clearInterval(interval);

    }, [liveClock]);

    return (
        <section className="optimization-controls">

            <div className="optimization-heading">

                <div>
                    <h2>
                        ⚙️ Performance Optimization
                    </h2>

                    <p>
                        Toggle optimization techniques
                        and observe component re-renders.
                    </p>
                </div>

                <div className="live-time">
                    {liveClock
                        ? time.toLocaleTimeString()
                        : "Clock OFF"}
                </div>

            </div>

            <div className="optimization-options">

                {/* React.memo */}

                <div className="optimization-option">

                    <div className="option-top">

                        <button
                            className={
                                `switch ${memoEnabled
                                    ? "switch-on"
                                    : ""
                                }`
                            }
                            onClick={() =>
                                setMemoEnabled(
                                    !memoEnabled
                                )
                            }
                        >
                            <span />
                        </button>

                        <strong>
                            React.memo on cards
                        </strong>

                    </div>

                    <p>
                        Skip a card's re-render when
                        its props have not changed.
                    </p>

                </div>

                {/* useCallback */}

                <div className="optimization-option">

                    <div className="option-top">

                        <button
                            className={
                                `switch ${callbackEnabled
                                    ? "switch-on"
                                    : ""
                                }`
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
                        Keeps delete and drag handlers
                        referentially stable.
                    </p>

                </div>

                {/* useMemo */}

                <div className="optimization-option">

                    <div className="option-top">

                        <button
                            className={
                                `switch ${memoCalculationEnabled
                                    ? "switch-on"
                                    : ""
                                }`
                            }
                            onClick={() =>
                                setMemoCalculationEnabled(
                                    !memoCalculationEnabled
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
                        Cache event calculations until
                        posts change.
                    </p>

                </div>

            </div>

            <div className="controls-bottom">

                <div className="live-clock-control">

                    <button
                        className={
                            `switch ${liveClock
                                ? "switch-on"
                                : ""
                            }`
                        }
                        onClick={() =>
                            setLiveClock(
                                !liveClock
                            )
                        }
                    >
                        <span />
                    </button>

                    <div>
                        <strong>
                            Live Clock
                        </strong>

                        <p>
                            Updates every second to
                            simulate unrelated state.
                        </p>
                    </div>

                </div>

                <button
                    className="reset-button"
                    onClick={onReset}
                >
                    🔄 Reset Counters
                </button>

            </div>

        </section>
    );
}

export default OptimizationControls;