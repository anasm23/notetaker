///Declare dependencies
const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json")
///
var app = express();
var PORT = process.env.PORT || 3002;

///express calls
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

///GET routes
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

///API routes
app.route("/api/notes").get(function (req, res) {
        res.json(db);
    }).post(function (req, res) {
        let filePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;
        let baseID = 50;
        ///
        for (let i = 0; i < db.length; i++) {
            let individualNote = db[i];

            if (individualNote.id > baseID) {
                baseID = individualNote.id;
            }
        } 
        newNote.id = baseID + 1;
        db.push(newNote)
        ///
        fs.writeFile(filePath, JSON.stringify(db), function (err) {
            if (err) {
                return console.log(err);
            }else{
                console.log("Note Successfully saved✅")
            }
        }); 
        res.json(newNote);
    });

app.delete("/api/notes/:id", function (req, res) {
    var filePath = path.join(__dirname, '/db/db.json');
    for (let i = 0; i < db.length; i++) {
        if (db[i].id == req.params.id) {
            db.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(db), function (err) {
        if (err) {
            return console.log(err);
        } else {
            console.log("Note Successfully deleted✅");
        }
    });
    res.json(db);
});

///server listening on Port 8008
app.listen(PORT, function () {
    console.log("Server running on Port " + PORT +"🌐");
});