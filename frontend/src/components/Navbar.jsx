import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  // 1. Grab the user state and the logout function from our Global Brain
  const { user, logout } = useAuth();

  // 2. We use this to redirect the user after they click logout
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clears local storage and state
    navigate("/"); // Sends them back to the home page
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* LEFT SIDE: The Logo / Home Link */}
        <Link
          to="/"
          className="text-xl font-bold tracking-wider text-orange-500"
        >
          DACBY<span className="text-white">News</span>
        </Link>

        {/* RIGHT SIDE: Dynamic Links based on Auth State */}
        <div className="flex items-center gap-4">
          {/* If 'user' exists, show these: */}
          {user ? (
            <>
              <span className="text-sm text-gray-400 hidden sm:block">
                Welcome, {user.username}
              </span>
              <Link
                to="/bookmarks"
                className="hover:text-orange-400 transition-colors"
              >
                Bookmarks
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            /* If 'user' is null, show Login/Register: */
            <>
              <Link
                to="/login"
                className="hover:text-orange-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded text-sm font-medium transition-colors text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
