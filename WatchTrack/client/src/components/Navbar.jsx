import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <img src="/logo.jpeg" alt="WatchTrack logo" style={{ height: "50px", verticalAlign: "middle", marginRight: "8px" }} />
        WatchTrack
      </Link>
      <div className="nav-links">
        <Link to="/">Movies</Link>
        {token ? (
          <>
            <Link to="/movies/new">Add Movie</Link>
            <span className="nav-user">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="link-button">
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/signin">Sign in</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}