import axios from "axios";
import { MapBounds } from "../models/MapBounds";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

export async function getNearbyDisasterNews(
    latitude: any,
    longitude: any,
    proximity: any,
) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/news/near`, {
            params: {
                longitude: longitude,
                latitude: latitude,
                proximity: proximity,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getMapAreaDisasterNews({
    south,
    west,
    north,
    east,
}: MapBounds) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/news/map`, {
            params: {
                south: south,
                west: west,
                north: north,
                east: east,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export async function getMapAreaDisasterNewsTest({
    south,
    west,
    north,
    east,
}: MapBounds) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/news/map-test`, {
            params: {
                south: south,
                west: west,
                north: north,
                east: east,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
