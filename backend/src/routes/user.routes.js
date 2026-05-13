import {Router} from "express";
import { registerUser, loginUser, toggleBookmark, getBookmarkedStories } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/bookmark/:storyId").post(verifyJWT, toggleBookmark);
router.route("/bookmarks").get(verifyJWT, getBookmarkedStories);

export default router;