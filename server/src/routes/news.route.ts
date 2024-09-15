import express, { Request, Response } from "express";
import firestore from '../../firebase';  // Use the initialized Firestore instance
import { GeoFirestore, GeoCollectionReference } from 'geofirestore';
import admin from 'firebase-admin';


const router = express.Router();

const geoFirestore: GeoCollectionReference = new GeoFirestore(firestore).collection('news');


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

// GET news near a specific location (geospatial query without binding box)
router.get("/near", async (req: Request, res: Response) => {
    const { latitude, longitude, proximity } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).send("Invalid query parameters");
    }

    try {
        // Use the correct method 'near' for geospatial queries
        const query = geoFirestore.near({
            center: new admin.firestore.GeoPoint(parseFloat(latitude as string), parseFloat(longitude as string)),
            radius: parseInt(proximity as string) || 10  // Radius in kilometers
        });

        const snapshot = await query.get();
        const news = snapshot.docs.map(doc => doc.data());

        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// GET news within a bounding box (geospatial query with bounding box)
router.get("/map", async (req: Request, res: Response) => {
    const { south, west, north, east } = req.query;

    if (!south || !west || !north || !east) {
        return res.status(400).send("Invalid query parameters");
    }

    try {
        const snapshot = await firestore.collection('news')
            .where('location.latitude', '>=', parseFloat(south as string))
            .where('location.latitude', '<=', parseFloat(north as string))
            .where('location.longitude', '>=', parseFloat(west as string))
            .where('location.longitude', '<=', parseFloat(east as string))
            .get();

        const news = snapshot.docs.map(doc => doc.data());
        res.json(news);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
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
