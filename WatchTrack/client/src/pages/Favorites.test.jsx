import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { getFavorites } from "../api/api.js";
import Favorites from "./Favorites.jsx";

vi.mock("../api/api.js", () => ({
  getFavorites: vi.fn(),
}));

vi.mock("../context/auth.context.jsx", () => ({
  useAuth: () => ({ token: "test-token" }),
}));

describe("Favorites", () => {
  it("loads and displays the signed-in user's favorite movies", async () => {
    getFavorites.mockResolvedValue([
      {
        _id: "favorite-1",
        title: "The Matrix",
        year: 1999,
        genre: "Sci-Fi",
        posterUrl: "",
      },
    ]);

    render(
      <MemoryRouter>
        <Favorites />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading favorite movies...")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "The Matrix" })).toBeInTheDocument();
    expect(getFavorites).toHaveBeenCalledWith("test-token");
  });
});
