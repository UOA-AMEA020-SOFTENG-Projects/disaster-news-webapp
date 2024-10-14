import { Box, IconButton, Typography, useMediaQuery } from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContext, useEffect, useRef, useState } from "react";
import { DrawerContext } from "../../contexts/DrawerContext";
import { NewsCard } from "./DrawerComponents/NewsCard";
import { NewsPage } from "../NewsPage";
import { SelectedNewsContext } from "../../contexts/SelectedNewsContext";
import { NewsItem } from "../../models/NewsItem";
import { CenterContext } from "../../contexts/CenterContext";
import { useSwipeable } from "react-swipeable";

type DrawerPropsType = {
    news: NewsItem[][];
};

export function Drawer({ news }: DrawerPropsType) {
    const { isDrawerOpen, toggleDrawer, loading, updateLoading } =
        useContext(DrawerContext);
    const { selectedNews } = useContext(SelectedNewsContext);
    const [readMoreClicked, setReadMoreClicked] = useState<boolean>(false);
    const cardsContainerRef = useRef(null);
    const isMobile = useMediaQuery("(max-width: 600px)");
    const { userLocation, updateCenter } = useContext(CenterContext);
    const [idMap, setIdMap] = useState(new Map<string, string>());
    const [uniqueNews, setUniqueNews] = useState<NewsItem[]>([]);
    const [newsProcessing, setNewsProcessing] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0); // Track current index
    const itemsPerPage = 2; // Number of articles shown per 'page' in sidebar
    const [scrollPosition, setScrollPosition] = useState(0);  // For smooth transition between articles



    // Populate uniqueNews from the news prop on mount (assuming news is passed as a prop)
    useEffect(() => {
        const uniqueArticles = news.flat().slice(); // Given that news is an array of arrays
        setUniqueNews(uniqueArticles);
    }, [news]);

    const handleNext = () => {
        if (currentIndex + itemsPerPage < uniqueNews.length) {
            setCurrentIndex(currentIndex + itemsPerPage);
        }
    };

    const handlePrev = () => {
        if (currentIndex - itemsPerPage >= 0) {
            setCurrentIndex(currentIndex - itemsPerPage);
        }
    };

    const scrollToCard = (cardId: any) => {
        const cardElement = document.getElementById(idMap.get(cardId)!);
        if (cardElement) {
            cardElement.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        setNewsProcessing(true);
        if (!loading) {
            const uniqueNews: NewsItem[] = [];
            const titleToNewsMap = new Map<string, any>();
            const idMap = new Map<string, string>();

            // Reduce the news array to only unique news items in O(n) time.
            news.forEach(([marker]) => {
                if (!titleToNewsMap.has(marker.title)) {
                    uniqueNews.push(marker);
                    titleToNewsMap.set(marker.title, marker);
                }
                idMap.set(marker.id, titleToNewsMap.get(marker.title).id);
            });

            setIdMap(idMap);
            setUniqueNews(uniqueNews);
            setNewsProcessing(false);
        }
    }, [loading]);

    useEffect(() => {
        if (!loading && selectedNews && !newsProcessing) {
            scrollToCard(selectedNews.id);
        }
    }, [selectedNews, newsProcessing]);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            toggleDrawer(true);
        },
        onSwipedRight: () => {
            toggleDrawer(false);
        },
    });

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                position: "fixed", // Fixed to the screen
                top: 0,
                left: 0, // Drawer header always stays visible
                width: "300px", // Fixed width of the drawer
                height: "100vh", // Full height of the viewport
                backgroundColor: "#00026E",
                zIndex: 10, // Ensure it's on top
                overflow: "hidden", // No visible scroll
            }}
        >
            {/* Drawer Header with "Latest Stories" and Toggle Button */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px",
                    backgroundColor: "primary",
                    height: "70px",

                }}
            >
    <Typography variant="h6" color="white" sx={{ flexGrow: 1, textAlign: "center" }}>
        Latest Stories
    </Typography>

                {/* Arrow Button to Toggle Drawer Content Visibility */}
                <IconButton
                    onClick={() => toggleDrawer(!isDrawerOpen)} // Toggle drawer content visibility
                    sx={{ marginLeft: "auto" }}  // Ensure the button stays on the far right

                >
                    {isDrawerOpen ? (
                        <KeyboardArrowLeftIcon
                            fontSize="large"
                            sx={{ color: "white" }}
                        />
                    ) : (
                        <KeyboardArrowRightIcon
                            fontSize="large"
                            sx={{ color: "white" }}
                        />
                    )}
                </IconButton>
            </Box>

            {/* Drawer Content that Slides In/Out */}
            <Box
                ref={cardsContainerRef}
                sx={{
                    width: isDrawerOpen ? "300px" : "0px", // Slide content in/out
                    transition: "width 0.3s ease-in-out",
                    overflow: "hidden", // Allow scroll for news items (TODO: REMOVE ONCE SCROLL ARROW STARTS WORKING)
                    paddingBottom: "40px", // Add space for the arrow
                    position: "relative",
                }}
            >
                <Box
                    sx={{
                        transition: "transform 0.5s ease-in-out", // Smooth transition
                        transform: `translateY(${scrollPosition}%)`, // Move up or down
                    }}
                ></Box>
                {news.length === 0 && (
                    <Typography>No news available</Typography>
                )}
                {uniqueNews
                    .slice(currentIndex, currentIndex + itemsPerPage)
                    .map((newsItem) => (
                        <NewsCard
                            key={newsItem.id}
                            newsMarker={newsItem}
                            setReadMoreClicked={() => setReadMoreClicked(true)}  // Ensure this updates to true on click
                            idMap={idMap}
                        />
                    ))}
            </Box>

            {/* Arrow to Scroll To Next Set of Articles */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    position: "absolute",
                    bottom: "10px",
                    width: "100%",
                }}
            >
                <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
                    <KeyboardArrowUpIcon
                        fontSize="large"
                        sx={{ color: "white" }}
                    />
                </IconButton>
                <IconButton
                    onClick={handleNext}
                    disabled={currentIndex + itemsPerPage >= uniqueNews.length}
                >
                    <KeyboardArrowDownIcon
                        fontSize="large"
                        sx={{ color: "white" }}
                    />
                </IconButton>
            </Box>
        </Box>
    );
}
