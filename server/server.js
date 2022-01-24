// Requiring the needed modules
const express = require("express");
const bodyParser = require("body-parser")
const sqlite = require('sqlite3').verbose();

// Creating the application and database
var app = express();
var db = dataBase('./phones.db');

app.use(bodyParser.json());

// Making the app run on port 3000
app.listen(3000,()=> console.log("Server is running on port 3000"));

// Test the localhost:3000
app.get("/test", (req,res)=> {
	res.status(200).json({success: true});
});

// Make the connection to the phones database
function dataBase (phones){
	
	var db = new sqlite.Database(phones,(err)=> {
		if (err) {
			console.error(err.message);
		}
		console.log("Successfully connected to the database")
	});
	// Create phones table if it does not exist
	db.serialize(() => {
        db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(50) NOT NULL,
        	model 	CHAR(50) NOT NULL,
        	os 	CHAR(20) NOT NULL,
        	screensize INTEGER NOT NULL,
			image 	CHAR(1000) NOT NULL
        	)`);
    });
    return db;
};

// Select all phones in the database
let retrieveAll = `SELECT id, brand, model, os, image, screensize FROM phones `

/* Get all phones in the database
   URL call: http://localhost:3000/retrieveAll
*/
app.get('/retrieveAll', function(req, res) {
    db.all(retrieveAll, function(err, rows) {
        if (err) {
            console.log(err.message);
        }
		else{
        console.log("All phones in the database have been retrieved.");
        res.json(rows);
		}
    });
});

// Insert a new phone into the database
let create_query = `INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`

/* Create a new phone row in the database
   URL call: http://localhost:3000/create
*/	
app.post("/create", function(req, res) {
    db.run(create_query,
        [req.body.brand, req.body.model, req.body.os, req.body.image, req.body.screensize],
        function(err, rows) {
            if (err) {
				console.log(err.name);
				console.log(err.message);
            }
			else {
            console.log(`Phone has been added to the database and has id ${this.lastID}.`);
            res.status(201).send({
                message: `Phone has been added to the database and has id ${this.lastID}.`
            });
			}	
        });
});

// Select phone with matching id
let retrieve_query = `SELECT * FROM phones WHERE id= ?`
// Delete phone with matching id
let delete_query = "DELETE FROM phones WHERE id= ?"

/* Delete a phone with the given id
   URL call: http://localhost:3000/delete/id
*/
app.delete("/delete/:id", function(req, res) {
    db.all(retrieve_query, req.params.id, function(err, rows) {
        if (rows.length == 0) {
            console.log(`Phone with id ${req.params.id} was not found.`);
            res.status(404).send({
                message: `Phone with id ${req.params.id} was not found.`
            });
        } else db.run(delete_query, req.params.id,
            function(err) {
                if (err) {
                    return console.error(err.message);
                }
				else {
                console.log(`Phone with id ${req.params.id} has been deleted from the database.`);
                res.send(`Phone with id ${req.params.id} has been deleted from the database.`);
				}
            })
    })
});

// Update phone which matches the given id 
let update_query = `UPDATE phones SET brand=?, model=?, os=?, image=?, screensize=? WHERE id=?`

/* Update phone which matches the given id 
   URL call: http://localhost:3000/update/id
*/
app.put("/update/:id", function(req, res) {
    db.all(retrieve_query, req.params.id, function(err, rows) {
        if (rows.length == 0) {
            console.log(`Phone with id ${req.params.id} was not found.`);
            res.status(404).send({
                message: `Phone with id ${req.params.id} was not found.`
            });
        } else db.run(update_query,
            [req.body.brand, req.body.model, req.body.os, req.body.image, req.body.screensize, req.params.id],
            function(err, rows) {
                if (err) {
                    console.log(err.message);
                    return;
                }
				else {
                res.send(`Phone with id ${req.params.id} has been updated.`)
                console.log(`Phone with id ${req.params.id} has been updated.`);
				}
            })
    });
});

/* Retrieve phone which matches the given id 
   URL call: http://localhost:3000/retrieve/id
*/
app.get('/retrieve/:id', function(req, res) {
    db.all(retrieve_query, req.params.id, function(err, rows) {
        if (rows.length == 0) {
            console.log(`Phone with id ${req.params.id} was not found.`);
            res.status(404).send({
                message: `Phone with id ${req.params.id} was not found.`
            });
        }
		else {
			console.log(`Phone with id ${req.params.id} has been retrieved.`);
			res.json(rows);
		}
    })
});

/* Additional function to reset the database; delete all phones from the database
   URL call: http://localhost:3000/reset
*/
reset_query = "DELETE FROM phones"
app.delete("/reset", function(req, res) {
    db.all(retrieveAll, function(err, rows) {
        db.run(reset_query, function(err) {
			if (err) {
                    return console.error(err.message);
                }
			else {
				console.log(`All phones are deleted from the database.`);
                res.send(`All phones are deleted from the database.`);
			}
            })
    })
});