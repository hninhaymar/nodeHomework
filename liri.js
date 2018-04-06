require("dotenv").config();
var keys = require('./keys.js');
var Spotify = require('node-spotify-api');

var fs = require("fs");

var action = process.argv[2];
var options = process.argv.slice(3);

console.log("action: " + action);
console.log("options: " + options);

var Liri = {
    "my-tweets" : function() {
        //show the last 20 tweets
        var Twit = require('twit');       
        //console.log(keys.twitter);  
        var T = new Twit(keys.twitter);
        var params = {
            screen_name: 'sqlgirl',
            count: 20
            };
        var output = "";
        T.get('statuses/user_timeline', params,function(err,data){
            if(err) { console.log(err); }
            output += "*************TWEETS****************** \n" ;
            data.forEach(function(element){
                output +=element.created_at + "\n";
                output += element.text + "\n";
                output += "*******************************\n";
            });
            outputData(output);
            console.log(output);
        });
        
    },
    "spotify-this-song" : function(songName){
        if(songName.length < 1){
            songName = "The Sign";
        }
        else{
            songName.join(" ");
        }
        
        var spotify = new Spotify(keys.spotify);
        //call spotify api and log artist(s), song name, preview link, album
        spotify.search({ type: 'track', query: songName, limit : 1 }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            var output = "Song Name: " + data.tracks.items[0].name + "\n";
            output += "Artists: " + data.tracks.items[0].artists[0].name + "\n";
            output += "Album: " + data.tracks.items[0].album.name + "\n";
            output += "Preview Link: " + data.tracks.items[0].preview_url + "\n";
            console.log(output);
            outputData(output);
         
        });
    },
    "movie-this" : function(movieName){
        console.log("movie-this function");
        if(movieName.length < 1){
            movieName = "Mr. Nobody";
        }
        else{
            movieName.join(" ");
        }
        var request = require("request");

        request("http://www.omdbapi.com/?t="+movieName+"&apikey=trilogy", function(error, response, body) {
            // If the request is successful (i.e. if the response status code is 200)
            if (!error && response.statusCode === 200) {
                var movieData = JSON.parse(body);
                var output = "Movie Title : " + movieData.Title + "\n";
                output += "Year: " + movieData.Year + "\n";
                output += "IMDB Rating: " + movieData.imdbRating + "\n";
                var rottenTomatoesRating = "";
                movieData.Ratings.forEach(function(r){
                    if(r.Source === "Rotten Tomatoes"){
                        rottenTomatoesRating = r.Value;
                    }
                });
                output += "Rotten Tomatoes Rating: " + rottenTomatoesRating + "\n";
                output += "Country produced in: " + movieData.Country + "\n";
                output += "Language: " + movieData.Language + "\n";
                output += "Plot: " + movieData.Plot + "\n";
                output += "Actors: " + movieData.Actors + "\n";
   
                outputData(output);
                console.log(output);
            }
        });


    },
    "do-what-it-says" : function(){
        var fileName = "random.txt";
        fs.readFile(fileName, "utf8", function(error, data) {
            if (error) {
                return console.log(error);
            }
            console.log(data);
            var arr = data.split(",");
            Liri[arr[0]](arr[1].split(" "));

        });


    }
}

function outputData(data){
    var fileName = "log.txt";
    fs.appendFile(fileName, data, function(err) {

        if (err) {
            console.log(err);
        }        
        else {
            console.log("Data Written to file " + fileName);
        }
    
    });
}

Liri[action](options);