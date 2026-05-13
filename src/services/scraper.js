// services/scraper.js
import axios from "axios";
import * as cheerio from "cheerio";
// REMOVED asyncHandler import
import { Story } from "../models/story.model.js";
import logger from "../logger.js";

// REMOVED asyncHandler wrapper. Just a standard async function!
export const scrapeHackerNews = async () => {
  try {
    console.log("Starting Hacker News scraper...");

    const { data } = await axios.get("https://news.ycombinator.com/");
    const $ = cheerio.load(data);
    const stories = [];

    $(".athing")
      .slice(0, 10)
      .each((index, element) => {
        const hnId = $(element).attr("id");
        const title = $(element).find(".titleline > a").first().text();
        const url = $(element).find(".titleline > a").first().attr("href");

        const subtextRow = $(element).next();

        const pointsText = subtextRow.find(".score").text();
        const points = parseInt(pointsText.replace(/[^0-9]/g, "")) || 0;

        const author = subtextRow.find(".hnuser").text();
        const postedAt = subtextRow.find(".age").text();

        stories.push({ hnId, title, url, author, points, postedAt });
      });

    for (const storyData of stories) {
      await Story.findOneAndUpdate({ hnId: storyData.hnId }, storyData, {
        upsert: true,
        returnDocument: "after",
      });
    }

    logger.info(`Successfully scraped and saved ${stories.length} stories.`);
    return stories; // Now this will successfully return back to your controller!
  } catch (error) {
    logger.error("Scraping failed:", error.message);
    throw error; // This throws the error up to the controller, where the controller's asyncHandler WILL catch it.
  }
}; // Removed the closing parenthesis from asyncHandler
