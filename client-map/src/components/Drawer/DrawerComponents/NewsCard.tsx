import { Box, Typography } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { NewsItem } from "../../../models/NewsItem";
import { useContext } from "react";
import { CenterContext } from "../../../contexts/CenterContext";
import { SelectedNewsContext } from "../../../contexts/SelectedNewsContext";

type NewsCardProps = {
    newsMarker: NewsItem;
    setReadMoreClicked: (clicked: boolean) => void;
    idMap: Map<string, string>;
};

export function NewsCard({
    newsMarker,
    setReadMoreClicked,
    idMap,
}: NewsCardProps) {
    const { selectedNews, updateSelectedNews } = useContext(SelectedNewsContext);

    const handleSelectedNewsCard = () => {
        // Ensure idMap and selectedNews are valid before accessing them
        if (selectedNews && idMap && newsMarker.id === idMap.get(selectedNews.id)) {
            updateSelectedNews(null);
        } else {
            updateSelectedNews(newsMarker);
        }
    };

    const handleReadMoreClick = (event: React.MouseEvent<SVGSVGElement>) => {
        event.stopPropagation(); // Stop the event from propagating to the parent container
        updateSelectedNews(newsMarker);
        setReadMoreClicked(true);
    };

    return (
<Box
    onClick={handleSelectedNewsCard}
    id={newsMarker.id}
    sx={{
        display: "flex",
        flexDirection: "column",
        padding: "15px",  // Add padding
        backgroundColor: "#f5f5dc",  // Match background color to white
        boxSizing: "border-box",
        width: "90%",
        border: selectedNews && idMap && idMap.get(selectedNews.id) === newsMarker.id
            ? "3px solid #000000"
            : "1px solid #e0e0e0",  // Lighter border when not selected
        borderRadius: "10px",  // Rounded corners
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",  // Added shadow
        marginBottom: "25px",  // Space between news cards
        cursor: "pointer",
    }}
>
    <img
        style={{ width: "100%", height: "100%", objectFit: "fill", borderRadius: "8px" }}
        src={newsMarker.image}
    />
    <Box sx={{ paddingTop: "10px" }}>
        <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
            {newsMarker.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#666666" }}>
            {newsMarker.subtitle}
        </Typography>
    </Box>
</Box>

    );
}
