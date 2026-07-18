// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_BASE = "http://localhost:3000";
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }
  return data;
}

// --- Auth ---
export const signup = (user) => request("/api/users", { method: "POST", body: user });
export const signin = (credentials) =>
  request("/api/auth/signin", { method: "POST", body: credentials });

// --- Movies ---
export const getMovies = (genre) =>
  request(`/api/movies${genre ? `?genre=${encodeURIComponent(genre)}` : ""}`);
export const getMovie = (movieId) => request(`/api/movies/${movieId}`);
export const createMovie = (movie, token) =>
  request("/api/movies", { method: "POST", body: movie, token });
export const updateMovie = (movieId, movie, token) =>
  request(`/api/movies/${movieId}`, { method: "PUT", body: movie, token });
export const deleteMovie = (movieId, token) =>
  request(`/api/movies/${movieId}`, { method: "DELETE", token });

// --- Reviews ---
export const getReviews = (movieId) => request(`/api/movies/${movieId}/reviews`);
export const createReview = (movieId, review, token) =>
  request(`/api/movies/${movieId}/reviews`, { method: "POST", body: review, token });
export const updateReview = (reviewId, review, token) =>
  request(`/api/reviews/${reviewId}`, { method: "PUT", body: review, token });
export const deleteReview = (reviewId, token) =>
  request(`/api/reviews/${reviewId}`, { method: "DELETE", token });