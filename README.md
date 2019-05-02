# liri-node-app

This node.js application takes in various commands and provides information on your movies, songs, and upcoming concert details of your favorite bands.

## Movies

By entering, "node liri.js movie-this -movie title-", the user will be presented with details of the movie entered such as release date, reviews, actors, etc.

![movie-this results](/images/movie-this.png)

## Songs

By entering, "node liri.js spotify-this-song -song title-", the user will be presented with details of the song entered such as artist, album title, and song title.  Try entering the command without a song name and see what happens!

![spotify-this-song results](/images/spotify-this-song.png)

## Concerts

By entering, "node liri.js concert-this -band name-", the user will be presented with details of upcoming conerts for the band entered to include the date and time, venue, and location of the event.

![concert-this results](/images/concert-this.png)

## File Commands

By entering, "node liri.js do-what-it-says", the results displayed will come from the random.txt file entry, running the subsequent command for the adjacent movie, song, etc.