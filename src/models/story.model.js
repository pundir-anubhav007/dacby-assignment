// models/story.model.js
import mongoose, { Schema } from "mongoose";

const storySchema = new Schema(
  {
    hnId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    url: { type: String, default: "https://news.ycombinator.com" }, // Fallback URL
    author: { type: String, default: "Hacker News" }, // Fallback Author
    points: { type: Number, default: 0 },
    postedAt: { type: String, default: "Recently" },
  },
  { timestamps: true },
);

export const Story = mongoose.model("Story", storySchema);
