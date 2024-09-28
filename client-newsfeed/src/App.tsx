import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { CenterContext } from "./contexts/CenterContext";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import { getNearbyDisasterNews } from "./api/news";
import { NewsItem } from "./models/NewsItem";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { NewsCard } from "./components/NewsCard";
import { Coordinates } from "./models/Coordinates";
import { getUserLocation } from "./utils/getUserLocation";
import { NewsPage } from "./components/NewsPage";
// import { SpeakingTextField } from "./components/SpeakingTextField"
import SpeakingTextField from "./components/SpeakingTextField"
import { SelectedNewsContext } from "./contexts/SelectedNewsContext";
import { TailSpin } from "react-loader-spinner";
import { useQuiz } from "./contexts/QuizContext";
import QuizModal from "./components/QuizModal";
import MapIcon from '@mui/icons-material/Map';
import AccessibleSearchBar from "./components/AccessibleSearch";

export default function App() {
  const { userLocation } = useContext(CenterContext);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [readMoreClicked, setReadMoreClicked] = useState<boolean>(false);
  const [firstArticle, setFirstArticle] = useState<NewsItem | null>(null);
  const [searchResults, setSearchResults] = useState<NewsItem[]>([]);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { updateUserLocation } = useContext(CenterContext);
  const { selectedNews } = useContext(SelectedNewsContext);
  const pageRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState<String>("");
  const [refresh, setRefresh] = useState(false);

  const { answers } = useQuiz();
  const isVoiceAssist = answers[3];
  const isHighContrast = answers[1] === "Yes";
  const isBiggerFont = answers[4] === "Yes";
  console.log(isHighContrast)

  useEffect(() => {
    async function fetchUserLocation() {
      const location: Coordinates | null = await getUserLocation();
      location && updateUserLocation(location);
    }
    fetchUserLocation();
  }, []);

  const handleWellingtonClicked = async () => {
    if (selectedLocation !== "Wellington") {
      const wellingtonNews = await getNearbyDisasterNews(
        -41.2924,
        174.7787,
        50000
      );

      const modifiedNews: NewsItem[] = wellingtonNews.map((news: any) => {
        return {
          id: news._id,
          title: news.title,
          description: news.body,
          source: news.source,
          image: news.image,
          location: {
            lat: news.location.coordinates[1],
            lng: news.location.coordinates[0],
          },
          createdAt: news.createdAt,
        };
      });

      setNews(modifiedNews);
      setSearchResults(modifiedNews);
      setSelectedLocation("Wellington");
    } else {
      setSelectedLocation("");
      setRefresh(!refresh);
    }
  };

  const handleAucklandClicked = async () => {
    if (selectedLocation !== "Auckland") {
      const aucklandNews = await getNearbyDisasterNews(
        -36.8509,
        174.7645,
        50000
      );

      const modifiedNews: NewsItem[] = aucklandNews.map((news: any) => {
        return {
          id: news._id,
          title: news.title,
          description: news.body,
          source: news.source,
          image: news.image,
          location: {
            lat: news.location.coordinates[1],
            lng: news.location.coordinates[0],
          },
          createdAt: news.createdAt,
        };
      });

      setNews(modifiedNews);
      setSearchResults(modifiedNews);
      setSelectedLocation("Auckland");
    } else {
      setSelectedLocation("");
      setRefresh(!refresh);
    }
  };

  useEffect(() => {
    async function fetchDisasterNews() {
      const disasterNews = await getNearbyDisasterNews(
        userLocation!.lat,
        userLocation!.lng,
        10000
      );

      const modifiedNews: NewsItem[] = disasterNews.map((news: any) => {
        return {
          id: news._id,
          title: news.title,
          description: news.body,
          source: news.source,
          image: news.image,
          location: {
            lat: news.location.coordinates[1],
            lng: news.location.coordinates[0],
          },
          createdAt: news.createdAt,
        };
      });
      setNews(modifiedNews);
      setSearchResults(modifiedNews);
      setFirstArticle(modifiedNews[0]);
    }

    if (userLocation) {
      fetchDisasterNews();
    }
  }, [userLocation, refresh]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tempSearchResults: NewsItem[] = news.filter(
      (n: NewsItem) =>
        n.title.toLowerCase().includes(e.target.value) ||
        n.description.toLowerCase().includes(e.target.value)
    );
    setSearchResults(tempSearchResults);
  };

  const [boxStyle, setBoxStyle] = useState({});

  useEffect(() => {
    setBoxStyle({
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      height: "calc(100vh - 70px)",
      width: "100%",
      padding: "16px",
      overflow: "auto",
      boxSizing: "border-box",
      position: "fixed",
      top: "70px",
      backgroundColor: isHighContrast ? "white" : "#FFF8E7",
      alignItems: !news.length ? "center" : "unset",
    });
  }, [isHighContrast, news.length]);

  function handleMapOpen(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Box className="App">
      <NavigationBar
        news={news}
        readMoreClicked={readMoreClicked}
        setReadMoreClicked={setReadMoreClicked}
        pageRef={pageRef}
        firstArticle={firstArticle}
      />

      <Box
        sx={{
          background: "white",
          width: "100%",
          height: "calc(100vh - 70px)",
          position: "fixed",
          right: readMoreClicked ? "0" : "-100%",
          transition: "right 0.3s ease-in-out",
          zIndex: "10",
          top: "70px",
        }}
      >
        <NewsPage newsMarker={selectedNews} />
      </Box>

      <Box
        style={boxStyle}
        ref={pageRef}
      >
        {/* <Box sx={{ display: "flex", alignItems: "center", gap: "16px", mb: 2 }}>
          <QuizModal />

          {isVoiceAssist === "Yes" ? (<SpeakingTextField
            id="filled-basic"
            label="Search"
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
          />) : (<TextField
            id="filled-basic"
            label="Search"
            onChange={handleSearchChange}
            sx={{ flexGrow: 1 }}
          />
          )}

          <Button
            startIcon={<MapIcon />}
            onClick={handleMapOpen}
          >
          </Button>

        </Box> */}
        <AccessibleSearchBar
          isBiggerFont={isBiggerFont}
          isVoiceAssist={isVoiceAssist}
          isHighContrast={isHighContrast}
          handleSearchChange={handleSearchChange}
          handleMapOpen={handleMapOpen}
        />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Northland
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor:
                selectedLocation == "Auckland" ? "#193a8c" : "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
            onClick={handleAucklandClicked}
          >
            Auckland
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Waikato
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Bay of Plenty
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Gisborne
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Hawke's Bay
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Taranaki
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor:
                selectedLocation == "Wellington" ? "#193a8c" : "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
            onClick={handleWellingtonClicked}
          >
            Wellington
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Nelson
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Canterbury
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            Otago
          </Button>

          <Button
            variant="contained"
            size="small"
            sx={{
              backgroundColor: "#333333",
              marginBottom: "5px",
              marginRight: "5px",
              fontSize: isBiggerFont ? "20px" : "14px"
            }}
          >
            West Coast
          </Button>
        </Box>

        <Typography
          sx={{ color: "gray", fontWeight: "100", textAlign: "center" }}
        >
          NEAR YOU
        </Typography>

        {news.length > 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "20px",
              padding: "20px",
            }}
          >
            {searchResults.map((marker) => (
              <NewsCard
                key={marker.id}
                newsMarker={marker}
                setReadMoreClicked={setReadMoreClicked}
              />
            ))}
          </Box>
        ) : (
          <Box>
            <TailSpin
              height="80"
              width="80"
              color="#000000"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
