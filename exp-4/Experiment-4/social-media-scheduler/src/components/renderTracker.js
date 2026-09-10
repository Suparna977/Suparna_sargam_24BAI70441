let renderStats = {
    totalRenders: 0,
    postCards: {},
    calendarRenders: 0,
};

let listeners = [];

export function trackPostCard(id) {
    renderStats.totalRenders += 1;

    renderStats.postCards[id] =
        (renderStats.postCards[id] || 0) + 1;

    notifyListeners();
}

export function trackCalendar() {
    renderStats.totalRenders += 1;
    renderStats.calendarRenders += 1;

    notifyListeners();
}

export function getRenderStats() {
    return renderStats;
}

export function subscribeToRenderStats(listener) {
    listeners.push(listener);

    return () => {
        listeners = listeners.filter(
            (item) => item !== listener
        );
    };
}

export function resetRenderStats() {
    renderStats = {
        totalRenders: 0,
        postCards: {},
        calendarRenders: 0,
    };

    notifyListeners();
}

function notifyListeners() {
    listeners.forEach((listener) => {
        listener(getRenderStats());
    });
}