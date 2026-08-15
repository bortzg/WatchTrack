import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getMovie,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  deleteMovie,
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../api/api.js";
import { useAuth } from "../context/auth.context.jsx";
import ReviewList from "../components/ReviewList.jsx";

const DEFAULT_TRAILERS = {
  "the dark knight": "https://www.youtube.com/watch?v=EXeTwQWrcwY",
  parasite: "https://www.youtube.com/watch?v=isOGD_7hNIY",
  "the matrix": "https://www.youtube.com/watch?v=vKQi3bBA1y8",
  interstellar: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
};

export default function MovieDetail() {
  const { movieId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const loadData = () => {
    setLoading(true);
    const favoritesRequest = token ? getFavorites(token) : Promise.resolve([]);
    Promise.all([getMovie(movieId), getReviews(movieId), favoritesRequest])
      .then(([movieData, reviewData, favoriteMovies]) => {
        setMovie(movieData);
        setReviews(reviewData);
        setIsFavorite(favoriteMovies.some((favorite) => favorite._id === movieId));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId, token]);

  const handleFavoriteToggle = async () => {
    if (!token) {
      navigate("/signin");
      return;
    }
    setError("");
    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(movieId, token);
        setIsFavorite(false);
      } else {
        await addFavorite(movieId, token);
        setIsFavorite(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createReview(movieId, { rating: Number(rating), comment }, token);
      setComment("");
      setRating(5);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewUpdate = async (reviewId, updates) => {
    setError("");
    try {
      await updateReview(reviewId, updates, token);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId, token);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMovieDelete = async () => {
    if (!window.confirm("Delete this movie and all its reviews?")) return;
    try {
      await deleteMovie(movieId, token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="page">Loading...</div>;
  if (!movie) return <div className="page">Movie not found.</div>;

  const isAdmin = token && user?.role === "admin";
  const trailerUrl = movie.trailerUrl || DEFAULT_TRAILERS[movie.title.trim().toLowerCase()];

  return (
    <div className="page">
      <div className="movie-detail">
        <div className="movie-poster large">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} />
          ) : (
            <div className="poster-placeholder">{movie.title[0]}</div>
          )}
        </div>
        <div>
          <h1>{movie.title}</h1>
          <p className="movie-meta">
            {movie.year} · {movie.genre} · Directed by {movie.director}
          </p>
          <p>{movie.description}</p>
          <button
            type="button"
            className={`favorite-button${isFavorite ? " is-favorite" : ""}`}
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
          >
            {isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
          </button>
          {trailerUrl && (
            <a
              href={trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="trailer-button"
            >
              Watch Trailer
            </a>
          )}
          {isAdmin && (
            <div className="owner-actions">
              <Link to={`/movies/${movieId}/edit`} className="link-button">
                Edit Movie
              </Link>
              <button className="danger-button" onClick={handleMovieDelete}>
                Delete Movie
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <section className="reviews-section">
        <h2>Reviews</h2>

        {token ? (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <label>
              Rating
              <select value={rating} onChange={(e) => setRating(e.target.value)}>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>
            <textarea
              placeholder="Share your thoughts on this movie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button type="submit">Submit Review</button>
          </form>
        ) : (
          <p className="empty-state">Sign in to write a review.</p>
        )}

        <ReviewList
          reviews={reviews}
          currentUserId={user?._id}
          isAdmin={isAdmin}
          onDelete={handleReviewDelete}
          onUpdate={handleReviewUpdate}
        />
      </section>
    </div>
  );
}
