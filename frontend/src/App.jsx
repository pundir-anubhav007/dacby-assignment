import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />{" "}
          <Route
            path="/bookmarks"
            element={<h1>Bookmarks Page Coming Soon</h1>}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
