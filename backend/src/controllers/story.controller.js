
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { scrapeHackerNews } from "../services/scraper.js";
import { Story } from "../models/story.model.js";


export const triggerScrape = asyncHandler(async (req, res) => {
  const stories = await scrapeHackerNews();

  if (!stories || stories.length === 0) {
    throw new ApiError(500, "Failed to scrape stories from Hacker News");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stories, "Scraping completed successfully"));
});
// controllers/story.controller.js

export const getStories = asyncHandler(async (req, res) => {
  // 1. Get page and limit from query, set defaults
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // 2. Fetch stories with sort, skip, and limit
  // Sorting by 'points' descending as you had it, or 'createdAt' for news
  const stories = await Story.find()
    .sort({ points: -1 })
    .skip(skip)
    .limit(limit);

  // 3. Get total count for frontend pagination controls
  const totalStories = await Story.countDocuments();

  if (!stories || stories.length === 0) {
    throw new ApiError(404, "No stories found in the database");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        stories,
        pagination: {
          total: totalStories,
          page,
          limit,
          totalPages: Math.ceil(totalStories / limit)
        }
      },
      "Stories fetched successfully"
    )
  );
});