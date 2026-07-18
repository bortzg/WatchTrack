import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signin } from "../api/api.js";
import { useAuth } from "../context/auth.context.jsx";

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await signin(form);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>Sign In</h1>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="stacked-form">
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <p>
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}