import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();


  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/stories?page=${page}&limit=10`);
        const { stories, pagination } = response.data.data;

        setStories(stories);
        setTotalPages(pagination.totalPages);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [page]);

  const handleBookmark = async (storyId) => {
    if (!user) {
      alert("Please login to bookmark stories!");
      return;
    }

    try {
      await api.post(`/users/bookmark/${storyId}`);
      alert("Bookmark toggled!");
    } catch (error) {
      console.error("Failed to bookmark", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
        Top Hacker News
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 font-bold mt-10">
          Loading stories...
        </p>
      ) : (
        <div className="space-y-4">
          {stories.map((story, index) => (
            <div
              key={story._id}
              className="bg-white p-4 border rounded shadow-sm flex items-start gap-4 hover:shadow-md transition"
            >
              <span className="text-gray-400 font-bold text-lg w-6 text-right">
                {(page - 1) * 10 + index + 1}.
              </span>

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

              {user && (
                <button
                  onClick={() => handleBookmark(story._id)}
                  className="text-gray-400 hover:text-orange-500 transition"
                  title="Save to bookmarks"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-between items-center bg-white p-4 border rounded shadow-sm">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded font-bold ${page === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
        >
          Previous
        </button>

        <span className="text-gray-600 font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded font-bold ${page === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
