import { type Request, type Response } from "express";
import express from "express";
import { auth } from '../middleware/auth.ts'
import { getMyLinks } from "../controllers/linksController.ts";

const route = express.Router();

/**
 * @route   GET /api/links/my-links
 * @desc    Get all links created by the logged-in user
 * @access  Private
 */
route.get("/my-links", auth, getMyLinks);

export default route;
