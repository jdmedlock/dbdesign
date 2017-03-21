// File name: mongoosetests.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes supporting Mongoose tests

const Account = require('../models/account');
const config = require('../config');
const express = require('express');
const hlog = require('../util/htmllog');
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
  const log = new hlog.HtmlLog();
  log.addEntry('Entered /mongoose/findall...');
  mongoose.Promise = global.Promise;
  mongoose.connect(mongoUri)
  .then(() => {
    Account.find({})
    .then((accounts) => {
      log.addEntry(accounts);
    })
    .catch((error) => {
      log.addEntry(`Error encountered retrieving all accounts. Error: ${error}`);
      log.writeLog('error',response);
    });
  })
  .catch((error) => {
    log.addEntry(`Error encountered establishing connection. Error: ${error}`);
    log.writeLog('error',response);
  });
  mongoose.disconnect();
});

module.exports = router;
