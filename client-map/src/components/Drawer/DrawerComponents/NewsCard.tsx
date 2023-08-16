import { Box, Typography } from "@mui/material";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { NewsItem } from "../../../models/NewsItem";
import { useContext } from "react";
import { CenterContext } from "../../../contexts/CenterContext";
import { SelectedNewsContext } from "../../../contexts/SelectedNewsContext";

type NewsCardProps = {
  newsMarker: NewsItem;
  setReadMoreClicked: (clicked: boolean) => void;
};

export function NewsCard({ newsMarker, setReadMoreClicked }: NewsCardProps) {
  const { updateCenter } = useContext(CenterContext);
  const { selectedNews, updateSelectedNews } = useContext(SelectedNewsContext);

  const handleSelectedNewsCard = () => {
    if (newsMarker.id == selectedNews?.id) {
      updateSelectedNews(null);
    } else {
      updateSelectedNews(newsMarker);
      //updateCenter(newsMarker.location);
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
        padding: "10px",
        backgroundColor: "secondary.main",
        boxSizing: "border-box",
        width: "100%",
        border:
          selectedNews?.id == newsMarker.id
            ? "4px #5182ff solid"
            : "4px #ffffff solid",
        transition: "border 0.1s ease-in-out",
        cursor: "pointer",
      }}
    >
      <img
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
        src={newsMarker.image}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingTop: "8px",
        }}
      >
        <Typography variant="h2">{newsMarker.title}</Typography>
        <ReadMoreIcon
          onClick={handleReadMoreClick}
          sx={{ marginLeft: "auto" }}
        />
      </Box>
    </Box>
  );
}
