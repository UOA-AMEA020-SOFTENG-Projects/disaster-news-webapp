import express, { Request, Response } from "express";
import { News } from "../models";
import News1 from "../models/news1.model";

const router = express.Router();

router.get("/testing", async (req: Request, res: Response) => {
    try {
        const newsData = await News1.find().limit(10);
        res.json(newsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const news = await News.find();
        res.send(news);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Server error" });
    }
});

router.get("/near-news", async (req: Request, res: Response) => {
    const { longitude, latitude, proximity } = req.query;

    if (!longitude || !latitude) {
        res.status(400).send("Invalid query parameters");
        return;
    }

    const lng = parseFloat(longitude as string);
    const lat = parseFloat(latitude as string);

    if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
        res.status(400).send("Longitude or latitude out of bounds");
        return;
    }

    console.log(lng + " ," + lat + " ," + proximity);

    try {
        const news = await News1.aggregate([
            {
                $geoNear: {
                    near: {
                        type: "Point",
                        coordinates: [lng, lat]
                    },
                    distanceField: "distance",
                    maxDistance: parseInt(proximity as string) || 10000,
                    spherical: true
                }
            }
        ]);

        res.json(news);
    } catch (e) {
        console.error(e);
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

// router.get("/map-test", async (req: Request, res: Response) => {
//     const { south, west, north, east } = req.query;
  
//     if (!south || !west || !north || !east) {
//       res.status(400).send("Invalid query parameters");
//       return;
//     }
  
//     try {
//       const news = await News1.find({
//         'location_coords': {
//           $geoWithin: {
//             $geometry: {
//               type: "Polygon",
//               coordinates: [[
//                 [parseFloat(west as string), parseFloat(south as string)],
//                 [parseFloat(east as string), parseFloat(south as string)],
//                 [parseFloat(east as string), parseFloat(north as string)],
//                 [parseFloat(west as string), parseFloat(north as string)],
//                 [parseFloat(west as string), parseFloat(south as string)]
//               ]]
//             }
//           }
//         }
//       });
  
//       res.json(news);
//     } catch (e) {
//       console.error(e);
//       return res.status(500).json({ error: "Server error" });
//     }
//   });

router.get("/map-test", async (req: Request, res: Response) => {
    const { south, west, north, east } = req.query;
  
    if (!south || !west || !north || !east) {
      res.status(400).send("Invalid query parameters");
      return;
    }
  
    try {
      // Define the polygon with the provided bounds
      const polygon = {
        type: "Polygon",
        coordinates: [[
          [parseFloat(west as string), parseFloat(south as string)],
          [parseFloat(east as string), parseFloat(south as string)],
          [parseFloat(east as string), parseFloat(north as string)],
          [parseFloat(west as string), parseFloat(north as string)],
          [parseFloat(west as string), parseFloat(south as string)]
        ]]
      };
  
      // Find documents where any point in 'location_coords' intersects the polygon
      const news = await News1.find({
        'location_coords': {
          $geoIntersects: {
            $geometry: polygon
          }
        }
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
