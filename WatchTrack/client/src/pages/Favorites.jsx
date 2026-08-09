import { useEffect, useState } from "react";
import { getFavorites } from "../api/api.js";
import MovieCard from "../components/MovieCard.jsx";
import { useAuth } from "../context/auth.context.jsx";

export default function Favorites() {
  const { token } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getFavorites(token)
      .then(setMovies)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Favorites</h1>
      </div>
      {loading && <p>Loading favorite movies...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="empty-state">You have not added any favorite movies yet.</p>
      )}
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
