var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var probe = require('probe-image-size');
const path = require('path');
var app = express();

var port = Number(process.env.PORT || 3001);
var apiServerHost = (process.env.ELASTIC_URL || 'http://127.0.0.1:9200')

var cors = require('cors');

app.use(cors());

app.use(express.static('frontend/build'));

app.use('/healthy', (req, res, body) => {
	res.sendStatus(200);
});

app.use('/searchUI', (req, res, body) => {
	res.sendFile(path.join(__dirname+'/frontend/build/index.html'));
});

app.use('/_image', (req, res, body) => {
	let post = req.query.post;

	request({
		url: post,
		method: 'GET'
	  }, function(e, r, b) {
		if(!e){
			$ = cheerio.load(b);			
			if($('img')[0] !== undefined){
				res.send({url: $('img')[0].attribs.src});
				console.log({url: $('img')[0].attribs.src});
			}else{
				res.send({url: null});
			}
			
		}else{
			res.send({url: null});
		}
	  });
});

// Listen for requests on all endpoints
app.use('/', function(req, res, body) {
	// short-circuit favicon requests for easier debugging
	if (req.url != '/favicon.ico') {

		// Request method handling: exit if not GET or POST
		if ( ! (req.method == 'GET' || req.method == 'POST') ) {
			errMethod = { error: req.method + " request method is not supported. Use GET or POST." };
			console.log("ERROR: " + req.method + " request method is not supported.");
			res.write(JSON.stringify(errMethod));
			res.end();
			return;
		}

		// pass the request to elasticsearch
	  var url = apiServerHost + req.url;
		req.pipe(request({
		    uri  : url,
		    auth : {
		        user : '',
		        pass : ''
		    },
				headers: {
					'accept-encoding': 'none'
				},
		    rejectUnauthorized : false,
		}, function(err, res, body) {
		})).pipe(res); // return the elasticsearch results to the user
	}
});

// Server Listen
app.listen(port, function () {
	console.log('App server is running on http://localhost:' + port);
	console.log('config variable - ELASTIC_URL: ' + process.env.ELASTIC_URL);
	console.log('apiServerHost: ' + apiServerHost);
});