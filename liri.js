require("dotenv").config();

var keys = require("./keys");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
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
            displayDefault();
    }

}

runProgram(action, value);

function pullTweets() {
    var client = new Twitter(keys.twitter);

    var params = { screen_name: value ? value : 'digi_days' };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        console.log(error)
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                console.log(`
                    tweets: ${tweets[i].text}`)
            }
        }
    });
}



function getSpotify() {

    var spotify = new Spotify(keys.spotify)

    spotify.search({ type: 'track', query: value ? value : 'All the Small Things' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songResult = data.tracks.items
        for (var i = 0; i < songResult.length; i++) {
            console.log(`Album Artist:${songResult[i].album.artists[0].name}`)
        }
    });
}

function getMovie() {
    var request = require("request");

    var movieSubmission = value ? value : "Shawshank Redemption";



    var queryUrl = "http://www.omdbapi.com/?t=" + movieSubmission + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {


            console.log(`
            Movie: ${JSON.parse(body).Title}
            Release Year: ${JSON.parse(body).Year}`);
        }
    });
}

function displayDefault() {
    console.log(`Enter one of the following commands:
    **********
    For Twitter ----> "my-tweets
    FOr Spotify ----> "spotify-this-song"
    For OMDB  -----> "get-movie"
    ***********
    `

    )
}