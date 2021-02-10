const express = require('express')
const app = express()

//timedate  formatting
const moment = require("moment");

// listening port
const port = 3000
    //set view engine as ejs
app.set('view engine', 'ejs');

// Get MongoClient
var MongoClient = require('mongodb').MongoClient;

// db url, collection name and db name
const dburl = 'mongodb://192.168.1.159:27017';
const dbname = 'deauth_attacks';
const collname = 'attacks';

app.get('/', (req, res) => {
    res.render('index')
})

// process root url '/'
app.get('/dashboard', function(req, res) {

    // connect to DB
    MongoClient.connect(dburl, function(err, client) {
        if (!err) {

            // Get db
            const db = client.db(dbname);

            // Get collection
            const collection = db.collection(collname);


            // Find all documents in the collection

            collection.find().sort({ timestamp: -1 }).toArray(function(err, attacks) {
                if (!err) {
                    console.log("database connected!");
                    res.locals.moment = moment;

                    attacks.forEach(function(attack) {
                        console.log(attack.timestamp)
                    });

                    // render data to ejs
                    res.render('dashboard', { 'attacks': attacks })
                        //console.log(attacks)


                } else {
                    console.log("Error :" + err)
                }

            });

            // close db client
            client.close();
        }
    });
});

// listen on port 3000
app.listen(port, function() {
    console.log(`App listening on port:${ port }`)
});