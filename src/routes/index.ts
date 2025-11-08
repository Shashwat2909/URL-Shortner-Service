import express from 'express';
import { redirectUrl } from '../controllers/urlController.ts';

const router = express.Router();

/**
 * @route   GET /:code
 * @desc    Redirect to the long/original URL
 * @access  Public
 */
router.get('/:code', redirectUrl);


export default router;
