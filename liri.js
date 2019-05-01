require("dotenv").config();

const _ = require('lodash')
const Spotify = require('node-spotify-api');
const axios = require('axios');
const keys = require("./keys.js");
const fs = require('fs');
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
var entries = process.argv;
var entryArr = [];
// this function capitalizes the first letter of each word in the entries variable
String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

if (process.argv[3] === undefined && process.argv[2] !== "do-what-it-says") {
    console.log("Please enter a valid entry.")
    return;
} else if (process.argv[2] !== "do-what-it-says") {
    // This takes any input and capitalizes the first letter of each word
    for (i = 3; i < entries.length; i++) {
        entries[i] = entries[i].replaceAt(0, entries[i][0].toUpperCase());
        entryArr.push(entries[i]);
    }
    if (entryArr.length > 1) {
        var entry = entryArr.join(" ");
    } else {
        var entry = entryArr[0];
        var exchange = entry[0].toUpperCase();
        entry = entry.replaceAt(0, exchange);
        console.log(entry);
    }
}

// This function displays the date, venue, and location of the concert
const concertThis = () => {
    const bandURL = `https://rest.bandsintown.com/artists/${entry}/events?app_id=codingbootcamp`;
    axios.get(bandURL).then(
        function (response) {
            var results = response.data;
            for (i of results) {
                var loc;
                i.venue.region === "" ? loc = i.venue.country : loc = i.venue.region;
                console.log("===============================")
                console.log(`Date: ${moment(i.datetime).format('LLLL')}`);
                console.log(`Venue: ${i.venue.name}`);
                console.log(`Location: ${i.venue.city}, ${loc}`);
                console.log("===============================")
            }
        }
    )
}

const spotifySong = () => {
    spotify.search({ type: 'track', query: entry }).then(function (response) {
        var trackDeets = _.find(response.tracks.items, { name: entry });
        console.log(`Artist(s): ${trackDeets.artists[0].name}`);
        console.log(`Song Name: ${trackDeets.name}`);
        console.log(`Spotify Link: ${trackDeets.href}`);
        console.log(`Album Name: ${trackDeets.album.name}`);
    }).catch(function (err) {
        console.log(err);
    });
}
// This formats the random.txt file to work with the existing functions and read the inputs appropriately to get results
const makeFileEntry = () => {
    // removes quotations from entry
    entry = request[1].replace(/"/g, '');
    // puts the entry into an array
    var words = entry.split(" ");
    var wordArr = [];
    // if the words array is longer than one word, this capitalizes each word and turns the subsequent array into a string
    if (words.length > 1) {
        for (i = 0; i < words.length; i++) {
            words[i] = words[i].replaceAt(0, words[i][0].toUpperCase());
            wordArr.push(words[i]);
        }
        entry = wordArr.join(" ");
        // if the words array is only one word long, this will capitalize that word
    } else {
        entry = words[0];
        var exchange = entry[0].toUpperCase();
        entry = entry.replaceAt(0, exchange);
        console.log(entry);
    }
}
// var entry = process.argv[3].replace(/ /g, "+");


// This function pulls from the requested film from the OMDB API 
const movieThis = () => {
    const movieURL = `http://www.omdbapi.com/?t=${entry}&y=&plot=short&apikey=trilogy`;
    axios.get(movieURL).then(
        function (response) {
            var IMDB = _.find(response.data.Ratings, { Source: "Internet Movie Database" });
            var rt = _.find(response.data.Ratings, { Source: "Rotten Tomatoes" });
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
}

// This looks at the first entry following the js file and redirects to the appropriate function based on that entry
switch (process.argv[2]) {
    case "concert-this":
        concertThis();
        break;
    case "spotify-this-song":
        spotifySong();

        //     * Artist(s)

        //     * The song's name

        //     * A preview link of the song from Spotify

        //     * The album that the song is from

        //   * If no song is provided then your program will default to "The Sign" by Ace of Base.
        break;
    // If the user enters "movie-this", this case will pull the relevant details from the subsequent movie title from the OMDB API
    case "movie-this":
        movieThis();
        break;
    case "do-what-it-says":
        fs.readFile('random.txt', 'utf8', function (error, data) {
            if (error) {
                console.log(error);
            }
            request = data.split(",");
            if (request[0] === "concert-this") {
                makeFileEntry();
                concertThis();
            } else if (request[0] === "spotify-this-song") {
                makeFileEntry();
                spotifySong();
            } else if (request[0] === "movie-this") {
                makeFileEntry();
                movieThis();
            }
        })
        break;
    default:
        console.log("Please enter a valid command.");
        break;
}

