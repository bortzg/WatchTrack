import { useEffect, useState } from "react";
import { getMovies } from "../api/api.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    getMovies(search)
      .then(setMovies)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Browse Movies</h1>
        <input
          className="genre-filter"
          placeholder="Search by title, genre, or director..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
