import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ReviewList from "./ReviewList.jsx";

describe("ReviewList", () => {
  it("allows the review owner to edit a review", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    const reviews = [
      {
        _id: "review-1",
        rating: 4,
        comment: "Very good movie",
        user: { _id: "user-1", name: "Alex" },
      },
    ];

    render(
      <ReviewList
        reviews={reviews}
        currentUserId="user-1"
        onDelete={vi.fn()}
        onUpdate={onUpdate}
      />
    );

    await user.click(screen.getByRole("button", { name: "Edit" }));
    const comment = screen.getByRole("textbox");
    await user.clear(comment);
    await user.type(comment, "Excellent movie");
    await user.selectOptions(screen.getByRole("combobox"), "5");
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(onUpdate).toHaveBeenCalledWith("review-1", {
      rating: 5,
      comment: "Excellent movie",
    });
  });
});
