import openai
import spacy
from dotenv import dotenv_values
from geopy.geocoders import MapBox
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions

from pipeline import Pipeline, ExtractorFactory, ScraperFactory, SourceFactory, Api
from config import BROWSER

env_vars = dotenv_values()

def get_driver():
    if BROWSER == "chrome":
        options = ChromeOptions()
        options.add_argument('--headless')
        return webdriver.Chrome(options=options)
    else:  # default to Firefox
        options = FirefoxOptions()
        options.add_argument('--headless')
        return webdriver.Firefox(options=options)

def main():
    driver = get_driver()

    openai.api_key = env_vars["OPENAI_API_KEY"]

    source = SourceFactory.create_source("csv", "./dataset/nzhearld.csv")
    scraper = ScraperFactory.create_scraper("nzherald", driver)
    extractor = ExtractorFactory.create_extractor("spacy", spacy.load("en_core_web_trf"))
    # extractor = ExtractorFactory.create_extractor("openai", openai)
    geocoder = MapBox(env_vars["MAPBOX_API_KEY"])
    api = Api(env_vars["NEWS_POST_HTTP"])

    pipeline = Pipeline(source=source,
                        scraper=scraper,
                        extractor=extractor,
                        geocoder=geocoder,
                        api=api)

    pipeline.execute()

if __name__ == '__main__':
    main()
