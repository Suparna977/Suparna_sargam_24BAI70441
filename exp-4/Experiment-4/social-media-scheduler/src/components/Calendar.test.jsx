import React from "react";

import {
    render,
    screen,
} from "@testing-library/react";

import {
    Provider,
} from "react-redux";

import {
    configureStore,
} from "@reduxjs/toolkit";

import Calendar from "./Calendar";

import postReducer from "../redux/postSlice";


describe("Calendar Component", () => {


    test("renders calendar heading", () => {

        const store =
            configureStore({

                reducer: {
                    posts: postReducer,
                },

            });


        render(

            <Provider store={store}>

                <Calendar />

            </Provider>

        );


        expect(
            screen.getByText(
                "📅 Content Calendar"
            )
        ).toBeInTheDocument();


        expect(
            screen.getByText(
                /DRAG & DROP ENABLED/i
            )
        ).toBeInTheDocument();

    });


    test("renders scheduled post in calendar", () => {

        const store =
            configureStore({

                reducer: {
                    posts: postReducer,
                },

            });


        render(

            <Provider store={store}>

                <Calendar />

            </Provider>

        );


        expect(
            screen.getByText(
                /AI is changing the world/i
            )
        ).toBeInTheDocument();


        expect(
            screen.getByText(
                /Machine Learning Tips/i
            )
        ).toBeInTheDocument();

    });

});