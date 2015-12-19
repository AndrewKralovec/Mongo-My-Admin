var express = require('express');
var path = require('path'); //core module 
var databaseUrl = "localhost:27017/DB"; // default env
var bodyParser = require('body-parser');

// All possible mongo db objects 
var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    assert = require('assert');

// Configure app
var app = express(); 

// Store all html files in views 
app.use(express.static(__dirname + '/views'));
// Parses recived json input 
app.use(bodyParser.json());
// Store all js in Scripts folder
app.use(express.static(__dirname + '/scripts'));

// Technology not needed but good practice, especailly when serval people are working on it 
app.get('/', function (req, res) {
	res.sendFile('index.html');
}); 

// Listen for contactlist get request, aka transfers the contacklist in mongo to client
app.get('/databases', function (req, res) {
	// Default server is set to DB
	var db = new Db('DB', new Server('localhost', 27017));
	console.log("-- recived GET request --"); 
	db.open(function(err, db) {
	  // Use the admin database for the operation
	  var adminDb = db.admin();
	  // List all the available databases
	  adminDb.listDatabases(function(err, dbs) {
	    assert.equal(null, err);
	    assert.ok(dbs.databases.length > 0);
	    console.log(dbs);
	    res.json(dbs); 
	    db.close();
	  });
	});
}); 

// Listen for collection Post request
app.post('/collection', function (req, res) {
	console.log("-- recived collection post request --"); 
	var databaseName = req.body.contactItem ; 
	console.log('req contackItem: ' + databaseName);
	var db = new Db(databaseName, new Server('localhost', 27017));
	db.open(function(err, db) {
		db.listCollections().toArray(function(err, collections){
			for(var collection  of collections) {
			    console.log(collection); 
			}
			res.json(collections);
			db.close(); 
		}); 
    });
}); 

// Listen for viewcontactlist post request
app.post('/viewcollection', function (req, res) {
	console.log("-- recived viewcollection post request --"); 
	var databaseName = req.body.DB , collection = req.body.contactItem ; 
	var db = new Db(databaseName, new Server('localhost', 27017));
	db.open(function(err, db) {
	console.log(databaseName+": opened");
	// Cursor (pointer is just to C), will run through all documents inside the collection 
	var cursor = db.collection(collection).find();
		var array = [] ; 
		cursor.each(function(err, doc) {
			var isempty = false ; 
	    	assert.equal(err, null);
	    	if (!isempty && doc != null) {
	         console.log(doc);
	         array.push(doc); 
	    	}  
	    	else{
	    		isempty = true;
	    	}
	    	//fix race error
	    	if(isempty){
				res.json(array); 
				db.close(); 
	    	}
	   }); 
	}); 

});

// Listen for drop DB post request
app.post('/dropDB', function (req, res) {
	var databaseName = req.body.contactItem ; 
	console.log('req contackItem: ' + databaseName);
	var db = new Db(databaseName, new Server('localhost', 27017)); 
	// Establish connection to db
	db.open(function(err, db) {
	assert.equal(null, err);
		// Execute drop db command against the server
		db.command({dropDatabase: 1}, function(err, result) {
			assert.equal(null, err);
	    	db.close();
		});
	});
});

// Listen for addDB post request
app.post('/addDB', function (req, res) {
	var databaseName = req.body.contactItem ; 
	console.log('req contackItem: ' + databaseName);
	var db = new Db(databaseName, new Server('localhost', 27017)); 
	// Establish connection to db
	// No error handlling because this is not 'great' code, but its a work around 
	db.open(function(err, db) {
	  // Create a null collection
		db.createCollection("", {w:1}, function(err, collection){
	  		console.log("DB created"); 
	  		db.close();
		});
	});
});

// Listen for add contactlist post request
app.post('/addcollection', function (req, res) {
	var databaseName = req.body.DB , collectionName = req.body.contactItem ; 
	console.log('----creat collection req contackItem: ' + databaseName);
	var db = new Db(databaseName, new Server('localhost', 27017)); 
	// Establish connection to db
	db.open(function(err, db) {
		// Create a collection 
	    db.createCollection(collectionName, {w:1}, function(err, collection){
	  		console.log("Collection created"); 
	  		//collection.insert({default:false}); Leaves an id, thats no good 
	  		db.close(); 
		});
	});
});

// Listen for drop contactlist post request
app.post('/dropcollection', function (req, res) {
	var databaseName = req.body.DB , collectionName = req.body.contactItem ; 
	console.log('----drop req for : ' + databaseName);
	console.log('----collection : ' + collectionName);

	var db = new Db(databaseName, new Server('localhost', 27017)); 
	// Establish connection to db
	db.open(function(err, db) {
	    // Drop the collection 
        db.dropCollection(collectionName, function(err, result) {
          assert.equal(null, err);
          console.log(collectionName+": DROPED"); 
          db.close();
      }); 
	});

});

// Implement a web server to listen to requests [ port 444]
app.listen(4444, function(){
	console.log('ready on port 4444'); 
}); 


