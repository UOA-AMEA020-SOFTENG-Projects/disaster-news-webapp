import "./Map.css";
import { Box, IconButton } from "@mui/material";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useContext, useEffect, useState } from "react";
import { DrawerContext } from "../../contexts/DrawerContext";
import { UserLocationMarker } from "./MapComponents/UserLocation";
import { CenterContext } from "../../contexts/CenterContext";
import { mapOptions } from "../../utils/mapOptions";
import { Oval, ThreeDots } from "react-loader-spinner";
import { Coordinates } from "../../models/Coordinates";
import { getUserLocation } from "../../utils/getUserLocation";
import { NewsMarker } from "./MapComponents/NewsMarker";
import { NewsItem } from "../../models/NewsItem";
import CircleMarkerWithText from "./MapComponents/CircleMarkerWithText";
import { calculateProximityValue } from "../../utils/calculateProximityValue";
import { getMapAreaDisasterNews } from "../../api/news";
import { mapNewsArticles } from "../../utils/mapNewsArticles";
import { SelectedNewsContext } from "../../contexts/SelectedNewsContext";
import HomeIcon from "@mui/icons-material/Home";
import SearchBar from "./MapComponents/SearchBar";

type MapPropsType = {
    news: NewsItem[][];
    setNews: (modifiedNews: NewsItem[][]) => void;
};

export function Map({ news, setNews }: MapPropsType) {
    const { isDrawerOpen } = useContext(DrawerContext);
    const { loading, updateLoading } = useContext(DrawerContext);
    const { selectedNews } = useContext(SelectedNewsContext);
    const {
        center,
        updateCenter,
        userLocation,
        updateUserLocation,
        updateMapBounds,
        updateZoom,
        zoom,
        proximity,
        updateProximity,
    } = useContext(CenterContext);
    const [mapLoading, setMapLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyBVMfNn5ls36xpl3z_2CL19GD__JwkZR1M",
    });

    useEffect(() => {
        async function fetchUserLocation() {
            const location: Coordinates | null = await getUserLocation();
            location && updateUserLocation(location);
            location && updateCenter(location);
            location?.lat != 0 && setMapLoading(false);
        }
        fetchUserLocation();
    }, []);

    useEffect(() => {
        if (
            center.lat == userLocation?.lat &&
            center.lng == userLocation?.lng
        ) {
            handleMapBoundsChanged();
        }

        if (
            center.lat == selectedNews?.location.lat &&
            center.lng == selectedNews?.location.lng
        ) {
            handleMapBoundsChanged();
        }
    }, [center]);

    const handleMapBoundsChanged = async () => {
        if (map) {
            updateLoading(true);
            const mapBounds: any = map.getBounds()?.toJSON();
            updateMapBounds(mapBounds);
            updateZoom(map.getZoom()!);
        }
    };

    const handleMapLoad = async (map: google.maps.Map) => {
        setMap(map);
    };

    async function fetchInitialDisasterNews(mapBounds: any) {
        const disasterNews = await getMapAreaDisasterNews(mapBounds);
        mapNewsArticles({
            disasterNews: disasterNews,
            setNews: setNews,
            zoom: zoom,
            proximity: proximity,
        });
        updateLoading(false);
        setFirstLoad(false);
    }

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                height: "100vh",
                overflow: "hidden",
            }}
        >
            {loading && !mapLoading && (
                <Box
                    sx={{
                        backgroundColor: "#ededed",
                        borderRadius: "1rem",
                        boxShadow: "0px 2px 14px -3px rgba(0,0,0,0.75)",
                        height: "30px",
                        width: "70px",
                        position: "absolute",
                        zIndex: "10",
                        top: "8%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ThreeDots
                        height="40"
                        width="55"
                        radius="9"
                        color="#fffff"
                        ariaLabel="three-dots-loading"
                        wrapperStyle={{}}
                        visible={true}
                    />
                </Box>
            )}

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: "25px",
                    width: "100%",
                    position: "absolute",
                    zIndex: "10",
                    bottom: "25px",
                }}
            >
                <Box
                    sx={{
                        backgroundColor: "#000000",
                        opacity: "85%",
                        borderRadius: "100%",
                        boxShadow: "0px 2px 14px -3px rgba(0,0,0,0.75)",
                        height: "45px",
                        width: "45px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <IconButton
                        onClick={async () => {
                            map?.panTo(userLocation!);
                            //updateCenter(userLocation!);
                        }}
                    >
                        <HomeIcon fontSize="medium" sx={{ color: "white" }} />
                    </IconButton>
                </Box>
            </Box>

            <Box className={`map ${!isDrawerOpen && "full-width"}`}>
                {!isLoaded || mapLoading ? (
                    <Oval
                        height={80}
                        width={80}
                        color="#ffffff"
                        secondaryColor="#fffff"
                        strokeWidth={4}
                        strokeWidthSecondary={4}
                    />
                ) : (
                    <GoogleMap
                        mapContainerClassName="map-container"
                        onLoad={handleMapLoad}
                        center={center}
                        zoom={zoom}
                        options={mapOptions}
                        onZoomChanged={() => {
                            if (map) {
                                updateCenter(map?.getCenter()?.toJSON()!);
                                updateProximity(
                                    calculateProximityValue(map?.getZoom()!),
                                );
                                handleMapBoundsChanged();
                            }
                        }}
                        onDragEnd={() => {
                            updateCenter(map?.getCenter()?.toJSON()!);
                            handleMapBoundsChanged();
                        }}
                        onBoundsChanged={() => {
                            firstLoad &&
                                fetchInitialDisasterNews(
                                    map?.getBounds()?.toJSON(),
                                );

                            if (
                                map?.getCenter()?.toJSON()!.lat.toFixed(5) ==
                                userLocation?.lat.toFixed(5) &&
                                map?.getCenter()?.toJSON()!.lng.toFixed(5) ==
                                userLocation?.lng.toFixed(5)
                            ) {
                                fetchInitialDisasterNews(
                                    map?.getBounds()?.toJSON(),
                                );
                            }
                        }}
                    >
                        <SearchBar onSearch={(location) => {
                            if (map) {
                                map.panTo(location);
                                updateCenter(location);
                                updateZoom(20)
                            }
                        }} />
                        <UserLocationMarker />

                        {news.map((markerArray) => {
                            {console.log(news)}
                            if (markerArray.length == 1) {
                                return (
                                    <NewsMarker
                                        key={markerArray[0].id}
                                        newsMarker={markerArray[0]}
                                    />
                                );
                            } else {
                                return (
                                    <CircleMarkerWithText
                                        key={markerArray[0].id}
                                        position={markerArray[0].location}
                                        text={markerArray.length.toString()}
                                    />
                                );
                            }
                        })}
                    </GoogleMap>
                )}
            </Box>
        </Box>
    );
}
