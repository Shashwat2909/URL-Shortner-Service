import { type Request, type Response } from "express";
import express from "express";

const route = express.Router();

route.get("/my-links", (req: Request, res: Response) => {



    res.status(200).json({
        success: true, message: "List of user's links will be here."
    })
})

export default route;
