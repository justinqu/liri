require("dotenv").config();

var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');


// var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);


//* `my-tweets`

var action = process.argv[2];
var value = process.argv.slice(3).join(" ");

var runProgram = function (usedata, functionsData) {

    switch (usedata) {
        case "my-tweets":
            pullTweets()
            break;
        case "spotify-this-song":
            getSpotify(functionsData);
            break;
        case "get-movie":
            getMovie()
            break;
            default:
            console.log("command not recognized")
    }

}

runProgram(action, value);

function pullTweets() {
    var params = { screen_name: 'digi_days' };
    console.log("test");

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        console.log(error)
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text)
            }
        }
    });
}


// * `spotify-this-song`

function getSpotify() {

    var spotify = new Spotify(keys.spotify)

    spotify.search({ type: 'track', query: 'All the Small Things' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songResult = data.tracks.items
        for (var i = 0; i < songResult.length; i++) {
            console.log(songResult[i].album.artists[0].name)
        }
    });
}

function getMovie() {
    var request = require("request");

    // Store all of the arguments in an array
    var nodeArgs = process.argv;

    // Create an empty variable for holding the movie name
    var movieName = "";

    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    for (var i = 2; i < nodeArgs.length; i++) {

        if (i > 2 && i < nodeArgs.length) {

            movieName = movieName + "+" + nodeArgs[i];

        }

        else {

            movieName += nodeArgs[i];

        }
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

          
            console.log("Release Year: " + JSON.parse(body).Year);
        }
    });
}