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

// Route - Retrieve all documents from the database.
//         http://localhost:3000/mongoose/findall
router.get('/findall', (request, response) => {
  const log = new hlog.HtmlLog();
  log.addEntry('<h2>Mongoose Test</h2>');
  log.addEntry('<h3>Execution Log:</h3>');
  log.addEntry('Entered /mongoose/findall...');
  mongoose.Promise = global.Promise;
  mongoose.connect(mongoUri)
  .then(() => {
    Account.find({})
    .then((accounts) => {
      log.addEntry(`There are ${accounts.length} accounts`);
      accounts.forEach((anAccount) => {
        log.addEntry(`Account: account_no:${anAccount.account_no} 
          owner_fname:${anAccount.owner_fname} 
          owner_mi:${anAccount.owner_mi} 
          owner_lname:${anAccount.owner_lname}`);
      });
      mongoose.disconnect();
      log.writeLog('normal', response, 'Findall test successfully completed');
    })
    .catch((error) => {
      log.addEntry(`Error encountered retrieving all accounts. Error: ${error}`);
      log.writeLog('error', response);
      mongoose.disconnect();
    });
  })
  .catch((error) => {
    log.addEntry(`Error encountered establishing connection. Error: ${error}`);
    log.writeLog('error', response);
  });
});

// Route - Retrieve specific documents from the database using a simple quesry.
//         http://localhost:3000/mongoose/simplequery
router.get('/simplequery', (request, response) => {
  const log = new hlog.HtmlLog();
  log.addEntry('<h2>Mongoose Test</h2>');
  log.addEntry('<h3>Execution Log:</h3>');
  log.addEntry('Entered /mongoose/simplequery...');
  mongoose.Promise = global.Promise;
  mongoose.connect(mongoUri)
  .then(() => {
    const query = Account.find({ owner_fname: 'Roger' });
    // If query.select is not specified all schema properties will be returned.
    // query.select('account_no owner_fname owner_mi owner_lname');
    query.exec()
    .then((accounts) => {
      log.addEntry(`There are ${accounts.length} accounts`);
      accounts.forEach((anAccount) => {
        log.addEntry(`Account: account_no:${anAccount.account_no} 
          owner_fname:${anAccount.owner_fname} 
          owner_mi:${anAccount.owner_mi} 
          owner_lname:${anAccount.owner_lname}`);
      });
      mongoose.disconnect();
      log.writeLog('normal', response, 'simplequery test successfully completed');
    })
    .catch((error) => {
      log.addEntry(`Error encountered retrieving all accounts. Error: ${error}`);
      log.writeLog('error', response);
      mongoose.disconnect();
    });
  })
  .catch((error) => {
    log.addEntry(`Error encountered establishing connection. Error: ${error}`);
    log.writeLog('error', response);
  });
});

module.exports = router;
