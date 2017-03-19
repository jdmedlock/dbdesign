// File name: mongoosetests.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes supporting Mongoose tests

const config = require('../config');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Establish a mongo connection using settings from the config.js file
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Retrieve all database rows using Mongoose.
//         http://localhost:3000/mongoose/findall
router.get('/findall', (request, response) => {
  const hlog = require('../util/htmllog');
  log.addEntry('Entered /mongoose/findall...');
  mongoose.connect(mongoUri)
});

module.exports = router;
