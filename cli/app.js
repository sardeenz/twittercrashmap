const express = require('express');
const app = express();
var fs = require('fs');
var http = require('http');
var mongoose = require('mongoose');
var Twit = require('twit');
var User = require('./db_model/tweets');

// ref: https://stackoverflow.com/questions/35572651/rxjs-node-js-http-request
mongoose.connect('mongodb://localhost/myappdatabase');

app.get('/', function (req, res) {

// create a new user called chris
var chris = new User({
  name: 'Chad',
  username: 'foleycb',
  password: 'password' 
});

  // get all the users
  User.find({}, function(err, users) {
    if (err) throw err;
  
    // object of all the users
    console.log(users);
  });

// call the custom method. this will just add -dude to his name
// user will now be Chris-dude
chris.dudify(function(err, name) {
  if (err) throw err;

  console.log('Your new name is ' + name);
});

// call the built-in save method to save to the database
chris.save(function(err) {
  if (err) throw err;

  console.log('User saved successfully!');
});
  // res.send('Hello World!');
  var testAddress = 'FALLS OF NEUSE RD & HARPS MILL RD'
  res.send(testAddress);
  
  http.get({
    host: 'maps.raleighnc.gov',
    // path: '/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=1413%20Scales%20st&City=null&State=null&ZIP=null',
    path: '/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=' + escape(testAddress) + '&City=null&State=null&ZIP=null'
  }, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
        // Data reception is done, do whatever with it!
        var parsed = JSON.parse(body);
        console.log('parsed = ', parsed.candidates[0].location);
    });
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

var twit = new Twit({
  consumer_key:         '7lFDwAtmqt7MbQPl0RctMRoV6',
  consumer_secret:      'bxFlEGBsDRIHRiKANoCLC6yzAhRSNE6QRzX8wrrEeybdkgKzM9',
  access_token:         '7374632-WxCEThennwx9PRU7thAff8Mrmm96ki3CfudkIMKNtZ',
  access_token_secret:  'ZkT5mHgKAXHomcjS4ba3hj5impB3QBXOkV2POE1tjkNho',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

// var stream = twit.stream('statuses/filter', {follow: ['7374632', '759251', '20647123','97739866','28785486','1367531','28785486','5695632','14956372','18918698']});
 var stream = twit.stream('statuses/filter', {follow: ['7374632', '20647123']});


stream.on('tweet', tweet => {
  if(tweet.retweeted || tweet.retweeted_status || tweet.in_reply_to_status_id || tweet.in_reply_to_user_id || tweet.delete) {
    // skip retweets and replies
    return;
  }
  console.log(`${tweet.user.name} posted: ${tweet.text}`);

  var str =`${tweet.text}`;
  var parsedTweet = str.split("-");
//   if (arr[2].match(/^\d/)) {
//     console.log(arr);
//  }

 var cleansedAddress = parsedTweet[2].replace( /&amp;/g, 'and' ).trim(); 
 console.log('cleansedAddress', cleansedAddress);
//  var testTweet = '*ACCIDENT: DAMAGE ONLY* - RALEIGH POLICE - FALLS OF NEUSE RD & HARPS MILL RD'
//  var testAddress = 'FALLS OF NEUSE RD & HARPS MILL RD'
const url = '/arcgis/rest/services/Locators/CompositeLocator/GeocodeServer/findAddressCandidates?SingleLine=&category=&outFields=*&maxLocations=&outSR=4326&searchExtent=&location=&distance=&magicKey=&f=json&Street=' + cleansedAddress + '&City=null&State=null&ZIP=null'
  console.log('url = ',url);
  cleansedAddress = encodeURI(url)
http.get({
  host: 'maps.raleighnc.gov',
  path: cleansedAddress
  }, function(response) {
    // Continuously update stream with data
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
        // Data reception is done, do whatever withN it!
         var parsed = JSON.parse(body);
        // console.log('parsed full', parsed);
        console.log('parsed = ', parsed.candidates[0].location);
    });
  });

});