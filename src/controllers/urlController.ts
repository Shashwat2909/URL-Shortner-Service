import { type Request, type Response } from 'express';
import validUrl from 'valid-url';
import Url from '../models/url.ts';
import { nanoid } from 'nanoid';

interface NewUrlData {
    longUrl: string;
    shortUrl: string;
    urlCode: string;
    userID?: string;
}

/**
 * @desc    This function will be responsible for creating a new short URL.
 *          It will handle the business logic of validating the long URL,
 *          checking for its existence, generating a short code, and saving
 *          it to the database.
 * @route   POST /api/shorten
 * @access  Public
 */
const shortenUrl = async (req: Request, res: Response) => {
    const { longUrl } = req.body;
    console.log("Received longUrl:", longUrl);
    if (!longUrl) {
        return res.status(400).json({ succcess: false, error: 'Please provide a valid URL' });
    }
    if (!validUrl.isUri(longUrl)) {
        return res.status(400).json({ success: false, error: "Invalid URL format" });
    }
    try {
        let url = await Url.findOne({ longUrl: longUrl });
        if (url) {
            return res.status(200).json({ success: true, data: url });
        }
        const urlCode = nanoid(7);

        const shortUrl = `${process.env.BASE_URL}${urlCode}`;

        const newUrlData: NewUrlData = {
            longUrl,
            shortUrl,
            urlCode
        }

        if (req.user && typeof req.user !== 'string' && 'id' in req.user) {
            newUrlData.userID = req.user.id;
        }

        url = await Url.create(newUrlData);

        res.status(201).json({
            success: true,
            message: 'URL is new. Code generated Successfully',
            data: url
        });
    } catch (error) {
        console.error("Database Error:", error)
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}

/**
 * @desc    Find a URL by its short code and redirect the user.
 * @route   GET /:code
 * @access  Public
 */
const redirectUrl = async (req: Request, res: Response) => {
    try {
        const url = await Url.findOne({ urlCode: req.params.code });

        if (url) {
            url.clicks++;
            await url.save();
            return res.redirect(301, url.longUrl);
        } else {
            return res.status(404).json({ success: false, error: 'No URL found' });
        }
    } catch (error) {
        console.error("Database Error:", error)
        res.status(500).json({ success: false, error: "Internal Server Error" })
    }
}

export {
    shortenUrl,
    redirectUrl
};
