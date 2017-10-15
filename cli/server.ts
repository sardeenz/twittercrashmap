import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { renderModuleFactory } from '@angular/platform-server';
import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
var http = require('http');
var Twit = require('twit');
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

// Our index.html we'll use as our template
const template = readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const { AppServerModuleNgFactory, LAZY_MODULE_MAP } = require('./dist/server/main.bundle');

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP)
  ]
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// - Example Express Rest API endpoints -
  app.get('/api/**', (req, res) => { 
    res.render('hi charles');
   });

   app.get('/chad/', (req, res) => { 
    res.render('chad', { req });
   });


// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser'), {
  maxAge: '1y'
}));

// ALl regular routes use the Universal engine
app.get('*', (req, res) => {
  //res.render('hi chad');
  res.render('index', { req });
  
});

// Start up the Node server
app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

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