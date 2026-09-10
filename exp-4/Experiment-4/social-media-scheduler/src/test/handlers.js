import { http, HttpResponse } from "msw";

export const handlers = [
    http.get("/api/events", () => {
        return HttpResponse.json([
            {
                id: 1,
                title: "Mock Event",
                platform: "LinkedIn",
                date: "2026-08-20",
                time: "10:00",
            },
        ]);
    }),
];