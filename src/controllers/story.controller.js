// controllers/story.controller.js
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { scrapeHackerNews } from "../services/scraper.js";
import { Story } from "../models/story.model.js";

// @desc    Trigger the web scraper
// @route   POST /api/scrape
export const triggerScrape = asyncHandler(async (req, res) => {
  const stories = await scrapeHackerNews();

  if (!stories || stories.length === 0) {
    throw new ApiError(500, "Failed to scrape stories from Hacker News");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stories, "Scraping completed successfully"));
});

// @desc    Fetch all stories (sorted by points descending)
// @route   GET /api/stories
export const getStories = asyncHandler(async (req, res) => {
  // The assignment specifically asks to sort by points descending
  const stories = await Story.find().sort({ points: -1 });

  if (!stories) {
    throw new ApiError(404, "No stories found in the database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, stories, "Stories fetched successfully"));
});
