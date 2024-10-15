import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { Map } from "./components/Map/Map";
import { Drawer } from "./components/Drawer/Drawer";
import { CenterContext } from "./contexts/CenterContext";
import { useContext, useEffect, useState } from "react";
import { getMapAreaDisasterNews, getMapAreaDisasterNewsTest } from "./api/news";
import { NewsItem } from "./models/NewsItem";
import { DrawerContext } from "./contexts/DrawerContext";
import { mapNewsArticles } from "./utils/mapNewsArticles";

export default function App() {
    const { userLocation, mapBounds, zoom, proximity, center } =
        useContext(CenterContext);
    const { updateLoading } = useContext(DrawerContext);
    const [news, setNews] = useState<NewsItem[][]>([]);

    useEffect(() => {
        async function fetchDisasterNews() {
            const disasterNews = await getMapAreaDisasterNews(mapBounds);
            console.log(disasterNews)
            const testing = await getMapAreaDisasterNewsTest(mapBounds);
            console.log(testing)
            mapNewsArticles({
                disasterNews: disasterNews,
                setNews: setNews,
                zoom: zoom,
                proximity: proximity,
            });

            updateLoading(false);
        }

        if (userLocation) {
            fetchDisasterNews();
        }
    }, [mapBounds]);

    return (
        <div className="App" style={{ height: "100svh" }}>
            <NavigationBar news={news} />
            <Map news={news} setNews={setNews} />
            <Drawer news={news} />
        </div>
    );
}
