import { NewsItem } from "../models/NewsItem";
import { groupObjectsByProximity } from "./groupObjectsByProximity";

interface MapNewsArticlesProps {
    disasterNews: any;
    setNews: (modifiedNews: NewsItem[][]) => void;
    zoom: number;
    proximity: number;
}

export function mapNewsArticles({
    disasterNews,
    setNews,
    zoom,
    proximity,
}: MapNewsArticlesProps) {
    console.log(disasterNews)
    console.log("runs")
    const modifiedNews: any = disasterNews.map((news: any) => {
        return {
        id: news._id,
          title: news.headline,
          summary: news.summary.summary_of_event_paragraphs,
          description: news.summary.summary_of_event,
          source: news.articles[0],
          lastUpdated: news.summary.last_updated,
          image: news.images[0],
          severity : news.summary.severity,
          location: news.location_coords.coordinates, // as 2D array
          endDate: news.summary.end_date,
          startDate: news.summary.start_date,
          recActions: news.summary.recommended_actions,
        };
    });

        // 2D array --> [[1,2], [3,4]]
        // 

        const newsArr: NewsItem[][] = [];
        modifiedNews.map((mNews : any) => {
            mNews.location.map((locs : number[]) => {
                console.log(mNews)
                const mod : NewsItem = {
                    id: mNews._id,
                    title: mNews.title,
                    summary: mNews.summary,
                    description: mNews.description,
                    source: mNews.source,
                    lastUpdated: mNews.lastUpdated,
                    image: mNews.image,
                    severity: mNews.severity,
                    endDate: mNews.endDate,
                    startDate: mNews.startDate,
                    recActions: mNews.recActions,
                    location: {
                        lat: locs[1], 
                        lng: locs[0],
                    },
                    categories: []
                }
                newsArr.push([mod]);
            })
        });
        console.log(newsArr)
        if(zoom > 3){
            setNews(newsArr);
        }
        else{
            const groupedNews = groupObjectsByProximity(modifiedNews, proximity);
            setNews(groupedNews);
        }
    
}
