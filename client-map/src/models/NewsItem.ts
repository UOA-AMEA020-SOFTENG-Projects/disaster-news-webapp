import { Coordinates } from "./Coordinates";

export interface NewsItem {
    id: string,
    endDate: string,
    startDate: string,
    severity: string,
    categories: string[],
    summary: string[],
    description: string[],
    recActions: string[],
    title: string,
    image: string,
    source: string,
    location: string[],
    lastUpdated: string,
}
