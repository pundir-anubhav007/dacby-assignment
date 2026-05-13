// routes/story.routes.js
import { Router } from "express";
import { triggerScrape, getStories } from "../controllers/story.controller.js";

const router = Router();

router.route("/scrape").post(triggerScrape);
router.route("/getStories").get(getStories);

export default router;
