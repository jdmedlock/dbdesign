// File name: server.js
// Date: 01/29/2017
// Programmer: Jim Medlock
//
// freeCodeCamp Backend Certificate API Project - URL Shortener Microservice

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

// Route - Display the application home page.
//         http://localhost:3000/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Route - Retrieve all database rows using Mongo.
//         http://localhost:3000/
router.get('/mongo/findall', function(req, res, next) {
});

// Route - Retrieve all database rows using Mongoose.
//         http://localhost:3000/
router.get('/mongoose/findall', function(req, res, next) {
});

// Route - Populate the database. If it already contains data clear it
//         before reloading.
//         http://localhost:3000/
router.get('/populatedb', function(req, res, next) {
  console.log("Enterd /populatedb...");
  const dbRecords = [
    {"account_no" : 111111, "owner_fname" : "John", "owner_mi" : "Q", "owner_lname" : "Public"},
    {"account_no" : 111112, "owner_fname" : "Jane", "owner_mi" : "I", "owner_lname" : "Thrify"},
    {"account_no" : 111113, "owner_fname" : "Roger", "owner_mi" : "A", "owner_lname" : "Johnsen"}
  ];
  mongoClient.connect(mongoUri)
    .then((db) => {
      console.log("Successfully connected to MongoDB");
      const collection = db.collection("accounts");
      const urlDocument = collection.count()
        .then((count) => {
          console.log("count: ", count);
        })
        .catch((error) => {
          console.log("TBD");
        });
    })
    .catch((error) => {
      console.log("Unable to establish connection to MongoDB",
        error);
    });
});

module.exports = router;
