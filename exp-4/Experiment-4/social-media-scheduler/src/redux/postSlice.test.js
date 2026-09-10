import { describe, test, expect } from "vitest";

import reducer, {
    addPost,
    updatePostDate,
    deletePost,
} from "./postSlice";


describe("postSlice", () => {

    test("adds a new post", () => {

        const initialState = {
            posts: [],
            lastAction: "Application loaded",
        };

        const newPost = {
            id: "10",
            title: "React Testing",
            platform: "LinkedIn",
            date: "2026-08-20",
            time: "10:00",
        };

        const state = reducer(
            initialState,
            addPost(newPost)
        );

        expect(state.posts).toHaveLength(1);

        expect(state.posts[0]).toEqual(newPost);

        expect(state.lastAction).toBe("Post added");
    });


    test("updates post date and time", () => {

        const initialState = {
            posts: [
                {
                    id: "1",
                    title: "AI Post",
                    platform: "LinkedIn",
                    date: "2026-08-15",
                    time: "10:00",
                },
            ],
            lastAction: "Application loaded",
        };

        const state = reducer(
            initialState,
            updatePostDate({
                id: "1",
                date: "2026-08-20",
                time: "15:30",
            })
        );

        expect(state.posts[0].date).toBe("2026-08-20");

        expect(state.posts[0].time).toBe("15:30");

        expect(state.lastAction).toBe(
            'Post "AI Post" rescheduled'
        );
    });


    test("does not update if post id does not exist", () => {

        const initialState = {
            posts: [
                {
                    id: "1",
                    title: "AI Post",
                    platform: "LinkedIn",
                    date: "2026-08-15",
                    time: "10:00",
                },
            ],
            lastAction: "Application loaded",
        };

        const state = reducer(
            initialState,
            updatePostDate({
                id: "999",
                date: "2026-08-20",
                time: "15:30",
            })
        );

        expect(state.posts[0].date).toBe("2026-08-15");

        expect(state.posts[0].time).toBe("10:00");

        expect(state.lastAction).toBe(
            "Application loaded"
        );
    });


    test("deletes a post", () => {

        const initialState = {
            posts: [
                {
                    id: "1",
                    title: "AI Post",
                    platform: "LinkedIn",
                    date: "2026-08-15",
                    time: "10:00",
                },
                {
                    id: "2",
                    title: "ML Post",
                    platform: "Twitter",
                    date: "2026-08-17",
                    time: "12:00",
                },
            ],
            lastAction: "Application loaded",
        };

        const state = reducer(
            initialState,
            deletePost("1")
        );

        expect(state.posts).toHaveLength(1);

        expect(state.posts[0].id).toBe("2");

        expect(state.lastAction).toBe(
            "Post deleted"
        );
    });


    test("handles unknown action", () => {

        const initialState = {
            posts: [],
            lastAction: "Application loaded",
        };

        const state = reducer(
            initialState,
            { type: "UNKNOWN_ACTION" }
        );

        expect(state).toEqual(initialState);
    });

});