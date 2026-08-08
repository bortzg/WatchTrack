import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MovieCard from "./MovieCard.jsx";

describe("MovieCard", () => {
  it("shows movie information and links to its detail page", () => {
    const movie = {
      _id: "movie-123",
      title: "Interstellar",
      year: 2014,
      genre: "Sci-Fi",
      posterUrl: "https://example.com/interstellar.jpg",
    };

    render(
      <MemoryRouter>
        <MovieCard movie={movie} />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Interstellar" })).toBeInTheDocument();
    expect(screen.getByText(/2014/)).toHaveTextContent("Sci-Fi");
    expect(screen.getByRole("img", { name: "Interstellar" })).toHaveAttribute(
      "src",
      movie.posterUrl
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/movies/movie-123");
  });
});
