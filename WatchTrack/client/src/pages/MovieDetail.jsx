import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovie, getReviews, createReview, deleteReview, deleteMovie } from "../api/api.js";
import { useAuth } from "../context/auth.context.jsx";
import ReviewList from "../components/ReviewList.jsx";

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

  const loadData = () => {
    setLoading(true);
    Promise.all([getMovie(movieId), getReviews(movieId)])
      .then(([movieData, reviewData]) => {
        setMovie(movieData);
        setReviews(reviewData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movieId]);

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

  const isOwner = token && user?._id === movie.createdBy;

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
          {isOwner && (
            <button className="danger-button" onClick={handleMovieDelete}>
              Delete Movie
            </button>
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
          onDelete={handleReviewDelete}
        />
      </section>
    </div>
  );
}