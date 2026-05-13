import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast"; // <-- Import toast

const Home = () => {
  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();


  const [bookmarkedIds, setBookmarkedIds] = useState(user?.bookmarks || []);

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
        toast.error("Failed to fetch stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [page]);

  const handleBookmark = async (storyId) => {
    if (!user) {
      toast.error("Please login to bookmark stories!");
      return;
    }


    const isBookmarked = bookmarkedIds.includes(storyId);

    if (isBookmarked) {

      setBookmarkedIds(bookmarkedIds.filter((id) => id !== storyId));
      toast.success("Removed from bookmarks");
    } else {

      setBookmarkedIds([...bookmarkedIds, storyId]);
      toast.success("Saved to bookmarks!");
    }


    try {
      await api.post(`/users/bookmark/${storyId}`);
    } catch (error) {
      console.error("Failed to toggle bookmark", error);

      toast.error("Something went wrong");
      if (isBookmarked) {
        setBookmarkedIds([...bookmarkedIds, storyId]);
      } else {
        setBookmarkedIds(bookmarkedIds.filter((id) => id !== storyId)); 
      }
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
          {stories.map((story, index) => {
            const isSaved = bookmarkedIds.includes(story._id);

            return (
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

                    className={`${isSaved ? "text-orange-500" : "text-gray-400"} hover:scale-110 transition-transform`}
                    title="Toggle bookmark"
                  >
                    {isSaved ? (
                      // FILLED SVG (Saved)
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
                    ) : (

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
                    )}
                  </button>
                )}
              </div>
            );
          })}
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
