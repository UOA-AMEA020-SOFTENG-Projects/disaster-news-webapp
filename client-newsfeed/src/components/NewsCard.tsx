import { Box, Typography } from "@mui/material";
import { NewsItem } from "../models/NewsItem";
import { useContext } from "react";
import { SelectedNewsContext } from "../contexts/SelectedNewsContext";

type NewsCardProps = {
  newsMarker: NewsItem;
  setReadMoreClicked: (clicked: boolean) => void;
};

export function NewsCard({ newsMarker, setReadMoreClicked }: NewsCardProps) {
  const { selectedNews, updateSelectedNews } = useContext(SelectedNewsContext);

  const handleSelectedNewsCard = () => {
    if (newsMarker.id == selectedNews?.id) {
      updateSelectedNews(null);
    } else {
      updateSelectedNews(newsMarker);
      setReadMoreClicked(true);
    }
  };

  return (
    <Box
      onClick={handleSelectedNewsCard}
      id={newsMarker.id}
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        // backgroundColor: "secondary.main",
        backgroundColor:"black",
        boxSizing: "border-box",
        // minWidth: "50%",
        width: "49%",
        // border: "3px #ffffff solid",
        transition: "border 0.1s ease-in-out",
        cursor: "pointer",
        borderRadius: "0.8rem",
        minHeight: "450px",
        justifyContent: "space-evenly"
      }}
    >
      <img
        style={{ width: "auto", maxHeight: "300px", objectFit: "contain" }}
        src={newsMarker.image}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          paddingTop: "8px",
        }}
      >
        <Typography variant="h2" 
          sx={{
            padding: "0px 15px",
            fontWeight:"bold",
            color: "white",
            textAlign: "center"
          }}
        >{newsMarker.title}</Typography>
      </Box>
    </Box>
  );
}
