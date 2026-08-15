import { useEffect, useState } from "react";
import { getUsers } from "../api/api.js";
import { useAuth } from "../context/auth.context.jsx";

export default function UsersList() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUsers(token)
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="page">Loading users...</div>;

  return (
    <div className="page">
      <h1>Members</h1>
      {error && <p className="error-text">{error}</p>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{new Date(u.created).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && <p className="empty-state">No members yet.</p>}
    </div>
  );
}
