import { type Request, type Response } from "express";
import url from "../models/url.ts"

/**
 * @desc    Get all links created by the currently logged-in user.
 * @route   GET /api/links/my-links
 * @access  Private
 */

const getMyLinks = async (req: Request, res: Response) => {
    try {
        if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
            res.status(401).json({
                success: false, error: "Not authorized to use the routes."
            })
        }

        const links = await url.find({ userID: (req.user as any).id }).sort({ date: -1 })

        res.status(200).json({
            success: true,
            count: links.length,
            data: links
        })

    } catch (error) {
        console.error("Error fetching url links", error);
        res.status(500).json({ success: false, error: "Internal server error: links controller" })
    }
}

export { getMyLinks };

