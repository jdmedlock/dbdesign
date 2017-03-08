// File name: index.js
// Date: 01/29/2017
// Programmer: Jim Medlock
//
// Primary route for the DbDesign app. This route is responsible for
// displayiing an overview and usage instructions.

const config = require('../config');
const express = require('express');
const mongodb = require('mongodb');
const path = require('path');

const router = express.Router();

// Establish a mongo connection using settings from the config.js file
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Display the application home page.
//         http://localhost:3000/
router.get('/', function(request, response, next) {
  response.sendFile(path.join(`${__dirname}/../views/index.html`));
});

module.exports = router;
