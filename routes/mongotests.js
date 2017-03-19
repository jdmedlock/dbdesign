// File name: mongotests.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes containing native Mongo tests.

const config = require('../config');
const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

const hlog = require('../util/htmllog');

// Establish a mongo connection using settings from the config.js file
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Retrieve all database rows using Mongo.
//         http://localhost:3000/mongo/findall
router.get('/findall', (request, response) => {
  const log = new hlog.HtmlLog();
  let accountsDb = null;
  log.addEntry('Entered /mongo/findall...');
  mongoClient.connect(mongoUri)
  .then((db) => {
    accountsDb = db;
    log.addEntry('Successfully connected to MongoDB');
    const collection = accountsDb.collection('accounts');
    return collection.find();
  })
  .then((cursor) => {
    cursor.each((error, item) => {
      if (item == null) {
        log.writeLog('normal', response);
        return;
      }
      log.addEntry(`Item: account_no:${item.account_no} owner_fname:${item.owner_fname} owner_mi:${item.owner_mi} owner_lname:${item.owner_lname}`);
    });
  })
  .catch((error) => {
    log.addEntry(`Unable to establish connection to MongoDB. Error: ${error}`);
    log.addEntry(`MongoUri: ${mongoUri}`);
    log.writeLog('error', response);
  });
});

module.exports = router;
