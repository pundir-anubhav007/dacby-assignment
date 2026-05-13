// models/story.model.js
import mongoose, { Schema } from "mongoose";

const storySchema = new Schema(
  {
    hnId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    url: { type: String, default: "https://news.ycombinator.com" },
    author: { type: String, default: "Hacker News" },
    points: { type: Number, default: 0 },
    postedAt: { type: String, default: "Recently" },
  },
  { timestamps: true },
);

export const Story = mongoose.model("Story", storySchema);
