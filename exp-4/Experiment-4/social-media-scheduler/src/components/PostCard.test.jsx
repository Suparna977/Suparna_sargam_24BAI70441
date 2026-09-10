import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PostCard from "./PostCard";

describe("PostCard Component", () => {

    const post = {
        id: "1",
        title: "React Performance",
        platform: "LinkedIn",
        date: "2026-08-25",
        time: "10:00",
    };

    test("renders post information", () => {

        render(
            <PostCard
                post={post}
                onDelete={() => { }}
            />
        );

        expect(
            screen.getByText("React Performance")
        ).toBeInTheDocument();

        expect(
            screen.getByText("LinkedIn")
        ).toBeInTheDocument();

        expect(
            screen.getByText(/2026-08-25/)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/10:00/)
        ).toBeInTheDocument();
    });


    test("delete button calls onDelete", async () => {

        const user = userEvent.setup();

        const onDelete = vi.fn();

        render(
            <PostCard
                post={post}
                onDelete={onDelete}
            />
        );

        const deleteButton =
            screen.getByRole("button");

        await user.click(deleteButton);

        expect(onDelete)
            .toHaveBeenCalledWith("1");
    });

});