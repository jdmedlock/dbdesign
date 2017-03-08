// File name: mongoosetests.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes supporting Mongoose tests

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

// Route - Retrieve all database rows using Mongoose.
//         http://localhost:3000/mongoose/findall
router.get('/findall', (request, response) => {
  console.log('Entered /mongoose/findall...');
});

module.exports = router;
