import mongoose, { Schema } from "mongoose";

const storySchema = new Schema(
  {
    hnId: { type: String, required: true, unique: true },

    title: { type: String, required: true },

    url: { type: String, required: true },

    author: { type: String, required: true },

    points: { type: Number, default: 0 },

    postedAt: { type: String }, 
  },
  { timestamps: true },
);

export const Story = mongoose.model("Story", storySchema);
