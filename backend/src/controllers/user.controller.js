import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";


export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({ username, email, password });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // 2. Validate password
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }


  const accessToken = user.generateAccessToken();


  const loggedInUser = user.toObject();
  delete loggedInUser.password;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,

        bookmarkIds: loggedInUser.bookmarks || [],
      },
      "User logged in successfully",
    ),
  );
});



export const toggleBookmark = asyncHandler(async (req, res) => {
    const { storyId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isBookmarked = user.bookmarks.includes(storyId);

    if (isBookmarked) {

        user.bookmarks.pull(storyId);
    } else {

        user.bookmarks.push(storyId);
    }

    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new ApiResponse(200, user.bookmarks, isBookmarked ? "Bookmark removed" : "Story bookmarked")
    );
});

export const getBookmarkedStories = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).populate("bookmarks");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            user.bookmarks,
            "Bookmarked stories fetched successfully"
        )
    );
});