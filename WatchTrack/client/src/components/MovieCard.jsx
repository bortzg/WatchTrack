import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="movie-card">
      <div className="movie-poster">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title} />
        ) : (
          <div className="poster-placeholder">{movie.title[0]}</div>
        )}
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-meta">
          {movie.year} · {movie.genre}
        </p>
      </div>
    </Link>
  );
}