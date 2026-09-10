import React from "react";

import {
    render,
    screen,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
    Provider,
} from "react-redux";

import {
    configureStore,
} from "@reduxjs/toolkit";

import PostForm from "./PostForm";

import postReducer from "../redux/postSlice";


function renderForm() {

    const store = configureStore({

        reducer: {
            posts: postReducer,
        },

    });


    render(

        <Provider store={store}>

            <PostForm />

        </Provider>

    );


    return store;
}


describe("PostForm Component", () => {


    test("renders schedule post form", () => {

        renderForm();


        expect(
            screen.getByText(
                "➕ Schedule Post"
            )
        ).toBeInTheDocument();


        expect(
            screen.getByPlaceholderText(
                "Enter post title"
            )
        ).toBeInTheDocument();


        expect(
            screen.getByRole(
                "button",
                {
                    name: /schedule post/i,
                }
            )
        ).toBeInTheDocument();

    });


    test("adds a new post", async () => {

        const user =
            userEvent.setup();


        const store =
            renderForm();


        const titleInput =
            screen.getByPlaceholderText(
                "Enter post title"
            );


        await user.type(
            titleInput,
            "Testing React Application"
        );


        await user.click(

            screen.getByRole(
                "button",
                {
                    name: /schedule post/i,
                }
            )

        );


        const posts =
            store.getState().posts.posts;


        expect(posts).toHaveLength(3);


        expect(posts[2].title)
            .toBe(
                "Testing React Application"
            );

    });


    test("does not add empty post", async () => {

        const user =
            userEvent.setup();


        const store =
            renderForm();


        await user.click(

            screen.getByRole(
                "button",
                {
                    name: /schedule post/i,
                }
            )

        );


        const posts =
            store.getState().posts.posts;


        expect(posts).toHaveLength(2);

    });

});