import { useContext } from "react";
import { CenterContext } from "../../../contexts/CenterContext";
import { MarkerF } from "@react-google-maps/api";
import { NewsItem } from "../../../models/NewsItem";
import { SelectedNewsContext } from "../../../contexts/SelectedNewsContext";
import { DrawerContext } from "../../../contexts/DrawerContext";

type NewsMarkerProps = {
    newsMarker: NewsItem;
};

export function NewsMarker({ newsMarker }: NewsMarkerProps) {
    const { updateCenter } = useContext(CenterContext);
    const { selectedNews, updateSelectedNews } =
        useContext(SelectedNewsContext);
    const { isDrawerOpen, toggleDrawer } = useContext(DrawerContext);
    const { updateLoading } = useContext(DrawerContext);

    const handleMarkerClick = async () => {
        updateSelectedNews(newsMarker);
        !isDrawerOpen && toggleDrawer(true);
        !isDrawerOpen && updateCenter(newsMarker.location);
        !isDrawerOpen && updateLoading(true);

        console.log(newsMarker.location)

        
        const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoid291eTQ0OCIsImEiOiJja2RrdzJjcWowMncyMzJxaTFqeGV2ZHhpIn0.YKQ7KO8v1Yqm3AkhqVPcPw';

        try {
            const { lng, lat } = newsMarker.location;
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place,locality,neighborhood`);
            const data = await response.json();
            const suburb = data.features[0]?.text || 'Unknown location';
            const speech = new SpeechSynthesisUtterance(suburb);
            window.speechSynthesis.speak(speech);

        } catch (error) {
            console.error('Error getting or speaking location:', error);
        } finally {
            updateLoading(false);
        }
    };

    const isSelected = selectedNews?.id === newsMarker.id;

        // Determine marker color based on severity
        let markerColor;
        switch (newsMarker.severity) {
            case "Low":
                markerColor = "#00FF00";  // Green
                break;
            case "Medium":
                markerColor = "#FFFF00";  // Yellow
                break;
            case "High":
                markerColor = "#FF0000";  // Red
                break;
            default:
                markerColor = "#f7726d";  // Default color
                break;
        }

    return (
        <MarkerF
            zIndex={isSelected ? 1000 : 10}
            key={isSelected ? "selected" : "not-selected"}
            position={newsMarker.location}
            onClick={handleMarkerClick}
            icon={{
                path: "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",
                fillColor: isSelected ? "#000000" : "#f7726d",
                fillOpacity: 1,
            }}
        />
    );
}
