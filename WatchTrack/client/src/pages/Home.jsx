import { useEffect, useState } from "react";
import { getMovies } from "../api/api.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    getMovies(genre)
      .then(setMovies)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [genre]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Browse Movies</h1>
        <input
          className="genre-filter"
          placeholder="Filter by genre..."
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
      </div>

      {loading && <p>Loading movies...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="empty-state">No movies yet. Add the first one!</p>
      )}

      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}