var request = require('request'); // "Request" library
var cookieParser = require('cookie-parser');
var express = require('express'); // Express web server framework
var querystring = require('querystring');

var client_id = 'CLIENT_ID'; // Your client id
var client_secret = 'CLIENT_SECRET'; // Your secret

var client_token = ''
var SpotifyWebApi = require('spotify-web-api-node');
var spotifyApi = new SpotifyWebApi({
  clientId : client_id,
  clientSecret : client_secret,
});

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

function getToken(){
  // your application requests authorization
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      // use the access token to access the Spotify Web API
      var token = body.access_token;
      client_token = token;
      spotifyApi.setAccessToken(token);
      //callback(token);
    }
  });
}

function getImage(token){

}
getToken()
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());

app.get('/get', function(req, res) {
  query = req.query.q;
  if(query){
    if (query.indexOf("spotify:track")!=-1){
      query = query.replace("spotify:track:","");
    } else if(query.indexOf("open.spotify.com/track/")!=-1){
      query = query.replace("open.spotify.com/track/","").replace("https://","");
    }
    console.log(query);
    
    spotifyApi.getTrack(query).then(function(data){
      //console.log(data.body.album.images[0].url)
      //console.log(data)
      res.redirect('/#' +
            querystring.stringify({
              url: data.body.album.images[0].url,
              id: data.body.id,
              name: data.body.name + " - " + data.body.artists[0].name
            }));
    }, function(err) {
      console.log(err)
      res.redirect('/#' +
            querystring.stringify({
              error: "1"
            }));
      //console.error(err);
    });
  } else {
    res.redirect('/#' +
          querystring.stringify({
            error: "1"
          }));
  }

  /*if (client_token == ""){
    getToken()
  }*/

  

  
});

app.listen(8888);

