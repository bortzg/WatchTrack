const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(`Cannot connect to API at ${API_BASE}`);
  }

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

// --- Users ---
export const getUsers = (token) => request("/api/users", { token });
export const getUser = (userId, token) => request(`/api/users/${userId}`, { token });
export const updateUser = (userId, updates, token) =>
  request(`/api/users/${userId}`, { method: "PUT", body: updates, token });
export const deleteUser = (userId, token) =>
  request(`/api/users/${userId}`, { method: "DELETE", token });

// --- Favorites ---
export const getFavorites = (token) => request("/api/favorites", { token });
export const addFavorite = (movieId, token) =>
  request(`/api/favorites/${movieId}`, { method: "POST", token });
export const removeFavorite = (movieId, token) =>
  request(`/api/favorites/${movieId}`, { method: "DELETE", token });

// --- Movies ---
export const getMovies = (search) =>
  request(`/api/movies${search ? `?search=${encodeURIComponent(search)}` : ""}`);
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
