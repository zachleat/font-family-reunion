var express = require( "express" );
var app = express();
var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var cors = require('cors');
var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

MongoClient.connect('mongodb://127.0.0.1:27017/fontfamilyreunion', function(err, db) {
	if(err) throw err;

	app.route('/save')
		.get(function(req, res, next) {
			res.send( "Use post." );
		})
		.post(function(req, res, next) {
			var ua = req.param( "ua" );
			var families = req.param( "families" ).split( ',' );
console.log( 'saving', ua, families );

			var collection = db.collection('fontfamilies');
			collection.insert({
				ua: ua,
				families: families,
				date: (new Date()).toString()
			}, function( err ) {
				if( err ) {
					throw err;
				}
			});

			res.send( '{ "status": "OK" }' );
		});

	var server = app.listen(3000, function() {
		console.log('Listening on port %d', server.address().port);
	});
});