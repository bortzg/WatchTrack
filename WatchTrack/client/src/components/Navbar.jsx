import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <img src="/logo.jpeg" alt="WatchTrack logo" className="brand-logo" />
        WatchTrack
      </Link>
      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Movies
        </NavLink>
        {token ? (
          <>
            {user?.role === "admin" && (
              <NavLink to="/movies/new" className={linkClass}>
                Add Movie
              </NavLink>
            )}
            <NavLink to="/users" className={linkClass}>
              Users
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              My Favorites
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              MyProfile
            </NavLink>
            <span className="nav-user">
              Hi, {user?.role === "admin" ? "Administrator" : user?.name}
            </span>
            <button onClick={handleLogout} className="link-button">
              Signout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/signin" className={linkClass}>
              Sign in
            </NavLink>
            <NavLink to="/signup" className={linkClass}>
              Sign up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
