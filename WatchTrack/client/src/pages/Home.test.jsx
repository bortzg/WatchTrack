import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getMovies } from "../api/api.js";
import Home from "./Home.jsx";

vi.mock("../api/api.js", () => ({
  getMovies: vi.fn(),
}));

describe("Home", () => {
  beforeEach(() => {
    getMovies.mockReset();
  });

  it("loads movies and filters them by genre", async () => {
    const user = userEvent.setup();
    getMovies.mockResolvedValue([
      {
        _id: "movie-1",
        title: "Parasite",
        year: 2019,
        genre: "Drama",
        posterUrl: "",
      },
    ]);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading movies...")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Parasite" })).toBeInTheDocument();
    expect(getMovies).toHaveBeenCalledWith("");

    await user.type(screen.getByPlaceholderText("Filter by genre..."), "Drama");
    await waitFor(() => expect(getMovies).toHaveBeenLastCalledWith("Drama"));
  });
});
