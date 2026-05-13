import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },

    password: { type: String, required: true },

    bookmarks: [
        { type: Schema.Types.ObjectId, ref: "Story" }
    ],
  },
  { timestamps: true },
);


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);
