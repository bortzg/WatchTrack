import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createMovie } from "../api/api.js";
import { useAuth } from "../context/auth.context.jsx";

export default function AddMovie() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    director: "",
    year: "",
    genre: "",
    description: "",
    posterUrl: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const movie = await createMovie(
        { ...form, year: Number(form.year) },
        token
      );
      navigate(`/movies/${movie._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>Add a Movie</h1>
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
          {submitting ? "Adding..." : "Add Movie"}
        </button>
      </form>
    </div>
  );
}