// Import express
var express = require('express');
var app = express();
const port = 3000;

// Get MongoClient
var MongoClient = require('mongodb').MongoClient;

// db url, collection name and db name
const dburl = 'mongodb://192.168.1.159:27017';
const dbname = 'deauth_attacks';
const collname = 'attacks';



// process root url '/'
app.get('/', function(req, res) {

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
                    //console.log(myJson.router)

                    // write HTML output
                    var output = '<html><header><title>List from DB</title> </header>';
                    output += '<body>'
                    output += '<h1>Attack List retrieved from DB</h1>';
                    output += '<table border="1"><tr><td><b>' + 'Date' + '</b></td><td><b>' + 'Router ATTACK' + '</b></td><td><b>' + 'Victim' + '</b></td> <td><b>' + 'ATTACK Router OUI' + '</b></td> <td><b>' + 'ATTACK Router brand' + '</b></td><td><b>' + 'ATTACK Packet Type' + '</b></td></tr>';

                    // process list
                    attacks.forEach(function(attack) {
                        output += '<tr><td>' + attack.timestamp + '</td><td>' + attack.router + '</td><td>' + attack.victim + '</td> <td>' + attack.routerInfo.oui + '</td><td>' + attack.routerInfo.company_name + '</td> <td>' + attack.type + '</td></tr>';
                    });

                    // write HTML output (ending)
                    output += '</table></body></html>'

                    // send output back
                    res.send(output);
                    //res.render(__dirname + "views/index.html", )

                    // log data to the console as well
                    console.log(attacks);

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