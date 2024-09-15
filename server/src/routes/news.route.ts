import express, { Request, Response } from "express";
import firestore from '../../firebase';  // Use the initialized Firestore instance

const router = express.Router();

// GET all news articles
router.get("/", async (req, res) => {
    try {
        const snapshot = await firestore.collection('news').get();
        const news = snapshot.docs.map(doc => doc.data());
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/near", async (req: Request, res: Response) => {
    const { longitude, latitude, proximity } = req.query;

    if (!longitude || !latitude) {
        res.status(400).send("Invalid query parameters");
        return;
    }

    try {
        const news = await News.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            parseFloat(longitude as string),
                            parseFloat(latitude as string),
                        ],
                    },
                    $maxDistance: parseInt(proximity as string) || 10000,
                },
            },
        });

        res.json(news);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Server error" });
    }
});

router.get("/map", async (req: Request, res: Response) => {
    const { south, west, north, east } = req.query;

    if (!south || !west || !north || !east) {
        res.status(400).send("Invalid query parameters");
        return;
    }

    try {
        const news = await News.find({
            location: {
                $geoWithin: {
                    $geometry: {
                        type: "Polygon",
                        coordinates: [
                            [
                                [
                                    parseFloat(west as string),
                                    parseFloat(south as string),
                                ],
                                [
                                    parseFloat(east as string),
                                    parseFloat(south as string),
                                ],
                                [
                                    parseFloat(east as string),
                                    parseFloat(north as string),
                                ],
                                [
                                    parseFloat(west as string),
                                    parseFloat(north as string),
                                ],
                                [
                                    parseFloat(west as string),
                                    parseFloat(south as string),
                                ],
                            ],
                        ],
                    },
                },
            },
        });

        res.json(news);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Server error" });
    }
});

router.post("/", async (req: Request, res: Response) => {
    const { title, body, source, image, location } = req.body;

    try {
        const news = new News({
            title,
            body,
            source,
            image,
            location,
        });

        await news.save();
        return res.status(201).json(news);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Server error" });
    }
});

export default router;
