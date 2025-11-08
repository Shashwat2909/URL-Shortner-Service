import express from "express";
import { shortenUrl } from "../controllers/urlController.ts";
import { auth } from "../middleware/auth.ts";

const router = express.Router();

/**
 * @route   POST /api/shorten
 * @desc    Create a new short URL
 * @access  Public
 */
router.post('/shorten', auth, shortenUrl);



export default router;
