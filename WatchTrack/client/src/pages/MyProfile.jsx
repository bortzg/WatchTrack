import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser } from "../api/api.js";
import { useAuth } from "../context/auth.context.jsx";

export default function MyProfile() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user?._id) return;
    getUser(user._id, token)
      .then((data) => setForm({ name: data.name, email: data.email, password: "" }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, token]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      // Only send password if the user actually typed a new one
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const updated = await updateUser(user._id, payload, token);
      login({ token, user: { _id: updated._id, name: updated.name, email: updated.email } });
      setForm({ ...form, password: "" });
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      await deleteUser(user._id, token);
      logout();
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="page narrow">Loading profile...</div>;

  return (
    <div className="page narrow">
      <h1>My Profile</h1>
      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <form onSubmit={handleSubmit} className="stacked-form">
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          New password (leave blank to keep current)
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button className="danger-button" onClick={handleDelete}>
        Delete My Account
      </button>
    </div>
  );
}