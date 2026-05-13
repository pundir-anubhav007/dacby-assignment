// services/scraper.js
import axios from "axios";
import * as cheerio from "cheerio";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { Story } from "../models/story.model.js";

export const scrapeHackerNews = asyncHandler(async () => {
  try {
    console.log("Starting Hacker News scraper...");

    // 1. Fetch the HTML
    const { data } = await axios.get("https://news.ycombinator.com/");

    // 2. Load HTML into Cheerio
    const $ = cheerio.load(data);
    const stories = [];

    // 3. Iterate over the first 10 elements with class 'athing'
    $(".athing")
      .slice(0, 10)
      .each((index, element) => {
        const hnId = $(element).attr("id"); // Get the unique Hacker News ID
        const title = $(element).find(".titleline > a").first().text();
        const url = $(element).find(".titleline > a").first().attr("href");

        // The subtext (points, author, time) is in the next sibling <tr>
        const subtextRow = $(element).next();

        // Extract and clean up the points (e.g., "150 points" -> 150)
        const pointsText = subtextRow.find(".score").text();
        const points = parseInt(pointsText.replace(/[^0-9]/g, "")) || 0;

        const author = subtextRow.find(".hnuser").text();
        const postedAt = subtextRow.find(".age").text(); // e.g., "3 hours ago"

        stories.push({ hnId, title, url, author, points, postedAt });
      });

    // 4. Save to Database efficiently
    for (const storyData of stories) {
      // Upsert: If the story (hnId) exists, update it. If not, insert it.
      await Story.findOneAndUpdate({ hnId: storyData.hnId }, storyData, {
        upsert: true,
        new: true,
      });
    }

    console.log(`Successfully scraped and saved ${stories.length} stories.`);
    return stories;
  } catch (error) {
    console.error("Scraping failed:", error.message);
    throw error;
  }
});
