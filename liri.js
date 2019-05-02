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

// If the user does not enter a band, they are prompted to enter a band
if (process.argv[3] === undefined && process.argv[2] === "concert-this") {
    console.log("Please enter a valid band.")
    return;
// If the user does not enter a movie, they are prompted to enter a movie
} else if (process.argv[3] === undefined && process.argv[2] === "movie-this") {
    console.log("Please enter a valid movie.")
    return;
} else if (process.argv[3]) {
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
    }
} else if (process.argv[2] === "spotify-this-song") {
    entry = "The Sign";
}

// This function logs the command and the date and time it was entered into the log.txt file
const logCommand = () => {
    fs.appendFile('log.txt', "\n" + moment().format('MMMM Do YYYY, h:mm:ss a') + " - " + process.argv + "\n", function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Content Added!");
        }
    })
}

// This function displays the date, venue, and location of the concert
const concertThis = () => {
    const bandURL = `https://rest.bandsintown.com/artists/${entry}/events?app_id=codingbootcamp`;
    logCommand();
    axios.get(bandURL).then(
        function (response) {
            var results = response.data;
            for (i of results) {
                var loc;
                var event;
                i.venue.region === "" ? loc = i.venue.country : loc = i.venue.region;
                event = `===============================
Date: ${moment(i.datetime).format('LLLL')}
Venue: ${i.venue.name}
Location: ${i.venue.city}, ${loc}
===============================`;
                console.log(event);
                fs.appendFile('log.txt', event, function (err) {
                    // If an error was experienced we will log it.
                    if (err) {
                      console.log(err)
                    }
                  })
                // console.log("===============================")
                // console.log(`Date: ${moment(i.datetime).format('LLLL')}`);
                // console.log(`Venue: ${i.venue.name}`);
                // console.log(`Location: ${i.venue.city}, ${loc}`);
                // console.log("===============================")
            }
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

// This uses the spotify API to pull details on a specific song entered by a user
const spotifySong = () => {
    logCommand();
    spotify.search({ type: 'track', query: entry }).then(function (response) {
        var trackDeets = _.find(response.tracks.items, { name: entry });
        var song = `===============================
Artist(s): ${trackDeets.artists[0].name}
Song Name: ${trackDeets.name}
Spotify Link: ${trackDeets.href}
Album Name: ${trackDeets.album.name}
===============================`;
        console.log(song);
        fs.appendFile('log.txt', song, function(err) {
            if (err) {
                console.log(err);
            }
        })
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

// This function pulls from the requested film from the OMDB API 
const movieThis = () => {
    const movieURL = `http://www.omdbapi.com/?t=${entry}&y=&plot=short&apikey=trilogy`;
    axios.get(movieURL).then(
        function (response) {
            logCommand();
            var IMDB = _.find(response.data.Ratings, { Source: "Internet Movie Database" });
            var rt = _.find(response.data.Ratings, { Source: "Rotten Tomatoes" });
            var movie = `===============================
Title: ${response.data.Title}
Release Date: ${response.data.Released}
IMDB Rating: ${IMDB.Value}
Rotten Tomatoes Rating: ${rt.Value}
Country where produced: ${response.data.Country}
Language: ${response.data.Language}
Plot: ${response.data.Plot}
Actors: ${response.data.Actors}
===============================`;
            console.log(movie);
            fs.appendFile('log.txt', movie, function(err) {
                if (err) {
                    console.log(err);
                }
            })
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

