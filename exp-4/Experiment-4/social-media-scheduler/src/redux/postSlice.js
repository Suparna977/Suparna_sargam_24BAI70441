import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [
        {
            id: "1",
            title: "AI is changing the world",
            platform: "LinkedIn",
            date: "2026-08-15",
            time: "10:00",
        },
        {
            id: "2",
            title: "Machine Learning Tips",
            platform: "Twitter",
            date: "2026-08-17",
            time: "12:00",
        },
    ],

    lastAction: "Application loaded",
};

const postSlice = createSlice({
    name: "posts",

    initialState,

    reducers: {
        addPost: (state, action) => {
            state.posts.push(action.payload);

            state.lastAction = "Post added";
        },

        updatePostDate: (state, action) => {
            const { id, date, time } = action.payload;

            const post = state.posts.find(
                (post) => post.id === id
            );

            if (post) {
                post.date = date;
                post.time = time;

                state.lastAction =
                    `Post "${post.title}" rescheduled`;
            }
        },

        deletePost: (state, action) => {
            state.posts = state.posts.filter(
                (post) => post.id !== action.payload
            );

            state.lastAction = "Post deleted";
        },
    },
});

export const {
    addPost,
    updatePostDate,
    deletePost,
} = postSlice.actions;

export default postSlice.reducer;