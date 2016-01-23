var express = require('express');
var router = express.Router();
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


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});


// Listen for contactlist get request, aka transfers the contacklist in mongo to client
router.get('/databases', function (req, res, next) {
    // Default server is set to DB
    var db = new Db('DB', new Server('localhost', 27017));
    console.log("-- recived GET request --");
    db.open(function (err, db) {
        // Use the admin database for the operation
        var adminDb = db.admin();
        // List all the available databases
        adminDb.listDatabases(function (err, dbs) {
            assert.equal(null, err);
            assert.ok(dbs.databases.length > 0);
            console.log(dbs);
            res.json(dbs);
            db.close();
        });
    });
}); 

// Listen for collection Post request
router.post('/collection', function (req, res, next) {
    console.log("-- recived collection post request --");
    var databaseName = req.body.DB;
    console.log('req contackItem: ' + databaseName);
    var db = new Db(databaseName, new Server('localhost', 27017));
    db.open(function (err, db) {
        db.listCollections().toArray(function (err, collections) {
            for (var collection of collections) {
                console.log(collection);
            }
            res.json(collections);
            db.close();
        });
    });
}); 

// Listen for viewcontactlist post request
router.post('/viewcollection', function (req, res, next) {
    console.log("-- recived viewcollection post request --");
    var databaseName = req.body.DB, collection = req.body.collection;
    var db = new Db(databaseName, new Server('localhost', 27017));
    db.open(function (err, db) {
        console.log(databaseName + ": opened");
        var cursor = db.collection(collection).find();
        var array = [];
        cursor.each(function (err, doc) {
            var isempty = false;
            assert.equal(err, null);
            if (!isempty && doc != null) {
                console.log(doc);
                array.push(doc);
            }
            else {
                isempty = true;
            }
            //fix race error
            if (isempty) {
                res.json(array);
                db.close();
            }
        });
    });

});

// Listen for drop DB post request
router.post('/dropDB', function (req, res, next) {
    var databaseName = req.body.DB;
    console.log('req contackItem: ' + databaseName);
    var db = new Db(databaseName, new Server('localhost', 27017)); 
    // Establish connection to db
    db.open(function (err, db) {
        assert.equal(null, err);
        // Execute drop db command against the server
        db.command({ dropDatabase: 1 }, function (err, result) {
            assert.equal(null, err);
            res.json(true);
            db.close();
        });
    });
});

// Listen for addDB post request
router.post('/addDB', function (req, res, next) {
    var databaseName = req.body.DB;
    console.log('req contackItem: ' + databaseName);
    var db = new Db(databaseName, new Server('localhost', 27017)); 
    // Establish connection to db
    db.open(function (err, db) {
        // Create a null collection
        db.createCollection(databaseName, { w: 1 }, function (err, collection) {
            if (err) throw err;
            console.log("DB created");
            res.json(true);
            db.close();
        });
    });
});

// Listen for add contactlist post request
router.post('/addcollection', function (req, res, next) {
    var databaseName = req.body.DB, collectionName = req.body.collection;
    console.log('----creat collection req contackItem: ' + databaseName);
    var db = new Db(databaseName, new Server('localhost', 27017)); 
    // Establish connection to db
    db.open(function (err, db) {
        // Create a collection 
        db.createCollection(collectionName, { w: 1 }, function (err, collection) {
            console.log("Collection created");
            res.json(true);
            db.close();
        });
    });
});

// Listen for drop contactlist post request
router.post('/dropcollection', function (req, res, next) {
    var databaseName = req.body.DB, collectionName = req.body.collection;
    console.log('----drop req for : ' + databaseName);
    console.log('----collection : ' + collectionName);

    var db = new Db(databaseName, new Server('localhost', 27017)); 
    // Establish connection to db
    db.open(function (err, db) {
        // Drop the collection 
        db.dropCollection(collectionName, function (err, result) {
            assert.equal(null, err);
            console.log(collectionName + ": DROPED");
            res.json(true);
            db.close();
        });
    });

});

// Listen for Create collection post request
router.post('/insertData', function (req, res, next) {
    var databaseName = req.body.DB, collection = req.body.collection, data = req.body.data;
    var db = new Db(databaseName, new Server('localhost', 27017));
    db.open(function (err, db) {
        // Insert a document in the capped collection
        db.collection(collection).insert(JSON.parse(data), { w: 1 }, function (err, result) {
            assert.equal(null, err);
            console.log("New user added");
            res.json(true);
            db.close();
        });
    });
});

// Listen for Create collection post request
router.post('/dropData', function (req, res, next) {
    var databaseName = req.body.DB, collection = req.body.collection, data = req.body.data;
    var par = { "_id": ObjectID(data._id) };
    var db = new Db(databaseName, new Server('localhost', 27017));
    db.open(function (err, db) {
        db.collection(collection).remove(par, function (err, result) {
            assert.equal(null, err);
            console.log("Data removed");
            res.json(true);
            db.close();
        });
    });

});
module.exports = router;
