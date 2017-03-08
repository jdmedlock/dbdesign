// File name: mongotests.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes containing native Mongo tests.

const config = require('../config');
const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

// Establish a mongo connection using settings from the config.js file
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Retrieve all database rows using Mongo.
//         http://localhost:3000/mongo/findall
router.get('/findall', (request, response) => {
  response.write('Entered /mongo/findall...');
  response.json({
    error: 'Invoked /mongo/findall route.',
  });
});

module.exports = router;
