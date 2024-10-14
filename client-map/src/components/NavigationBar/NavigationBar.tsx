import NotificationsIcon from "@mui/icons-material/Notifications";
import { Badge, Box, IconButton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { CenterContext } from "../../contexts/CenterContext";
import { DrawerContext } from "../../contexts/DrawerContext";
import { SelectedNewsContext } from "../../contexts/SelectedNewsContext";
import { NewsItem } from "../../models/NewsItem";

type NavigationBarPropsType = {
    news: NewsItem[][];
};

export function NavigationBar({ news }: NavigationBarPropsType) {
    const { toggleDrawer } = useContext(DrawerContext);
    const { updateSelectedNews } = useContext(SelectedNewsContext);
    const { updateCenter, userLocation, toggleHomeClicked } =
        useContext(CenterContext);
    const [notificationCount, setNotificationCount] = useState<number>(0);

    useEffect(() => {
        let count = 0;
        for (let i = 0; i < news.length; i++) {
            if (i > 99) {
                break;
            }
            count = count + news[i].length;
        }
        setNotificationCount(count);
    }, [news]);

    const handleNotificationClick = () => {
        toggleDrawer(true);
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "#00026E",
                padding: "8px",
                height: "70px",
                width: "100%",
                boxSizing: "border-box",
            }}
        >
            <Box
                sx={{
                    height: "100%",
                    padding: "8px",
                    paddingLeft: "6px",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    cursor: "pointer",
                }}
            >
                <img src="./logo.png" style={{ height: "100%" }} />
                <Typography variant="h1" color="white">
                    GEOHUB
                </Typography>
            </Box>
            <IconButton
                onClick={handleNotificationClick}
                sx={{ marginRight: "6px" }}
            >
                <Badge badgeContent={notificationCount} color="error">
                    <NotificationsIcon
                        fontSize="large"
                        sx={{ color: "white" }}
                    />
                </Badge>
            </IconButton>
        </Box>
    );
}
