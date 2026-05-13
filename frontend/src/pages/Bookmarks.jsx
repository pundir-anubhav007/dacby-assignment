import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Bookmarks = () => {
  const [bookmarkedStories, setBookmarkedStories] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const { user } = useAuth();

  useEffect(() => {
    // If there is no user, we don't even try to fetch
    if (!user) return;

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users/bookmarks");

        setBookmarkedStories(response.data.data);
      } catch (error) {
        console.error("Failed to fetch bookmarks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);


  const handleRemoveBookmark = async (storyId) => {
    try {
      await api.post(`/users/bookmark/${storyId}`);
      // Remove it from the UI instantly without refreshing the page
      setBookmarkedStories((prev) =>
        prev.filter((story) => story._id !== storyId),
      );
    } catch (error) {
      console.error("Failed to remove bookmark", error);
    }
  };


  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Your Reading List
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 font-bold mt-10">
          Loading your bookmarks...
        </p>
      ) : bookmarkedStories.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-500 text-lg mb-4">
            You haven't saved any stories yet.
          </p>
          <Link to="/" className="text-orange-500 font-bold hover:underline">
            Go back to the feed to find some!
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookmarkedStories.map((story) => (
            <div
              key={story._id}
              className="bg-white p-4 border rounded shadow-sm flex items-start gap-4 hover:shadow-md transition"
            >
              <div className="flex-1">
                <a
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-gray-900 hover:text-orange-500 transition"
                >
                  {story.title}
                </a>
                <div className="text-sm text-gray-500 mt-1">
                  {story.points} points
                </div>
              </div>


              <button
                onClick={() => handleRemoveBookmark(story._id)}
                className="text-orange-500 hover:text-gray-400 transition"
                title="Remove bookmark"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
