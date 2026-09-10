import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup";

describe("MSW API Mocking", () => {

    it("mocks an API response", async () => {

        server.use(
            http.get("http://localhost/api/events", () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        title: "Mock Event",
                        platform: "LinkedIn",
                    },
                ]);
            })
        );

        const response = await fetch(
            "http://localhost/api/events"
        );

        const data = await response.json();

        expect(response.ok).toBe(true);
        expect(data[0].title).toBe("Mock Event");
        expect(data[0].platform).toBe("LinkedIn");
    });

});