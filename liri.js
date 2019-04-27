require("dotenv").config();

const _ = require('lodash')
const Spotify = require('node-spotify-api');
const axios = require('axios');
const keys = require("./keys.js");
const spotify = new Spotify(keys.spotify);
var entry = process.argv[3].replace(/ /g, "+");
const movieURL = `http://www.omdbapi.com/?t=${entry}&y=&plot=short&apikey=trilogy`;

switch (process.argv[2]) {
    case "concert-this":

        break;
    case "spotify-this-song":

        break;
    case "movie-this":
        axios.get(movieURL).then(
            function (response) {
                var IMDB = _.find(response.data.Ratings, {Source: "Internet Movie Database"});
                var rt = _.find(response.data.Ratings, {Source: "Rotten Tomatoes"});
                console.log(`Title: ${response.data.Title}`);
                console.log(`Release Date: ${response.data.Released}`);
                console.log(`IMDB Rating: ${IMDB.Value}`);
                console.log(`Rotten Tomatoes Rating: ${rt.Value}`);
                console.log(`Country where produced: ${response.data.Country}`);
                console.log(`Language: ${response.data.Language}`);
                console.log(`Plot: ${response.data.Plot}`);
                console.log(`Actors: ${response.data.Actors}`);
            },

            function (error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request)
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message)
                }
                console.log(error.config)
            }
        )
        break;

    //     Title of the movie.
    //    * Year the movie came out.
    //    * IMDB Rating of the movie.
    //    * Rotten Tomatoes Rating of the movie.
    //    * Country where the movie was produced.
    //    * Language of the movie.
    //    * Plot of the movie.
    //    * Actors in the movie.
       
    case "do-what-it-says":
        break;
    default:
        console.log("Please enter a valid command.");
        break;
}