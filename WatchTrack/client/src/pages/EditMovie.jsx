import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovie, updateMovie } from "../api/api.js";
import { useAuth } from "../context/auth.context.jsx";

export default function EditMovie() {
  const { movieId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMovie(movieId)
      .then((movie) => {
        if (movie.createdBy !== user?._id) {
          setError("You can only edit movies you added.");
          return;
        }
        setForm({
          title: movie.title,
          director: movie.director,
          year: movie.year,
          genre: movie.genre,
          description: movie.description || "",
          posterUrl: movie.posterUrl || "",
        });
      })
      .catch((err) => setError(err.message));
  }, [movieId, user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await updateMovie(movieId, { ...form, year: Number(form.year) }, token);
      navigate(`/movies/${movieId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error && !form) return <div className="page narrow error-text">{error}</div>;
  if (!form) return <div className="page narrow">Loading...</div>;

  return (
    <div className="page narrow">
      <h1>Edit Movie</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="stacked-form">
        <label>
          Title
          <input name="title" value={form.title} onChange={handleChange} required />
        </label>
        <label>
          Director
          <input name="director" value={form.director} onChange={handleChange} required />
        </label>
        <label>
          Year
          <input
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Genre
          <input name="genre" value={form.genre} onChange={handleChange} required />
        </label>
        <label>
          Poster URL (optional)
          <input name="posterUrl" value={form.posterUrl} onChange={handleChange} />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}