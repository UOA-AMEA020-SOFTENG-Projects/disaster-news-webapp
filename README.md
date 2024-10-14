## Repository Details
- `./client-map` folder contains the React repository for the map-based disaster news app
- `./client-newsfeed` folder contains the React repository for the newsfeed-based disaster news app
- `./server` folder contains the Express repository for the backend API consumed by both client apps
- `./webscraper` folder contains the Python microservice pipeline for webscraping and processing news data from the internet. This has now been made obsolete, but remains within the codebase as an artifact, in the case it should be revived in the future.

## Running The Project
While the seperate sections of the project do have their own README's, this section provides a simple overview to get started running the application.

Open 3 integrated terminals - one in the client-newsfeed folder, one in the client-map folder, and one in the server folder. Following this, run the command 

```bash
npm i
```
to install all relevant dependencies. Following this, in the server folder, run 

```bash
npm run dev
```

to start up the server. Once the terminal displays the message 'Database connected!', run the same command above in each of the client-newsfeed and client-map terminals. This will then provide two local host links, which can be copied and pasted in your browser to access them!


## Docker

To build `newsfeed` and `map` app images, ensure you have docker desktop install. Then run

```bash
$ docker-compose up --build
```


