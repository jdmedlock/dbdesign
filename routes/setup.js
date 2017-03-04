// File name: setup.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes responsible for the setup of the test data in the Mongo database.

"use strict";
const config = require("../config");
const express = require("express");
const mongodb = require("mongodb");
const router = express.Router();

// Establish a mongo connection using settings from the config.js file
const mongoUri = "mongodb://" + config.db.host + "/" + config.db.name;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Populate the database. If it already contains data clear it
//         before reloading.
//         http://localhost:3000/setup/populatedb
router.get('/populatedb', function(request, response, next) {
  console.log("Entered /populatedb...");
  const dbRecords = [{
      "account_no": 111111,
      "owner_fname": "John",
      "owner_mi": "Q",
      "owner_lname": "Public"
    },
    {
      "account_no": 111112,
      "owner_fname": "Jane",
      "owner_mi": "I",
      "owner_lname": "Thrify"
    },
    {
      "account_no": 111113,
      "owner_fname": "Roger",
      "owner_mi": "A",
      "owner_lname": "Johnsen"
    }
  ];
  mongoClient.connect(mongoUri)
    .then((db) => {
      console.log("Successfully connected to MongoDB");
      const collection = db.collection("accounts");
      const urlDocument = collection.count()
        .then((count) => {
          console.log("count: ", count);
          dbRecords.forEach((element) => {
            console.log("element to be inserted: ", element);
            collection.insert([element])
              .then((writeResult) => {
                response.json({
                  error: writeResult
                });
                response.send();
              })
              .catch((error) => {
                response.json({
                  error: "Error inserting URL in database. Error: " +
                    error
                });
                if (err) {
    return res.send();
}
              });
          });
        })
        .catch((error) => {
          console.log("Error retrieving count of accounts. Error: ",
            error);
        });
    })
    .catch((error) => {
      console.log("Unable to establish connection to MongoDB",
        error);
    });
});

module.exports = router;
