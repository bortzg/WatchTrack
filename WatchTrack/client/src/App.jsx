import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Home from "./pages/Home.jsx";
import MovieDetail from "./pages/MovieDetail.jsx";
import AddMovie from "./pages/AddMovie.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import UsersList from "./pages/UsersList.jsx";
import EditMovie from "./pages/EditMovie.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route
            path="/movies/new"
            element={
              <PrivateRoute>
                <AddMovie />
              </PrivateRoute>
            }
          />
          <Route
            path="/movies/:movieId/edit"
            element={
              <PrivateRoute>
                <EditMovie />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MyProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UsersList />
              </PrivateRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<p className="page">Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}
