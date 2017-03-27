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

// Route - Retrieve all documents from the database.
//         http://localhost:3000/mongo/findall
router.get('/findall', (request, response) => {
  const log = new hlog.HtmlLog();
  let accountsDb = null;
  let collection = null;
  log.addEntry('<h2>Mongo Test</h2>');
  log.addEntry('<h3>Execution Log:</h3>');
  log.addEntry('Entered /mongo/findall...');
  mongoClient.connect(mongoUri)
  .then((db) => {
    accountsDb = db;
    collection = accountsDb.collection('accounts');
    log.addEntry('Successfully connected to MongoDB');
    return collection.count();
  })
  .then((count) => {
    log.addEntry(`Existing record count: ${count}`);
    return collection.find();
  })
  .then((cursor) => {
    cursor.each((error, anAccount) => {
      if (anAccount === null) {
        log.writeLog('normal', response, 'Findall test successfully completed');
        return;
      }
      log.addEntry(`Account: account_no:${anAccount.account_no} 
        owner_fname:${anAccount.owner_fname} 
        owner_mi:${anAccount.owner_mi} 
        owner_lname:${anAccount.owner_lname}`);
    });
    accountsDb.close();
  })
  .catch((error) => {
    log.addEntry(`Unable to establish connection to MongoDB. Error: ${error}`);
    log.addEntry(`MongoUri: ${mongoUri}`);
    log.writeLog('error', response);
  });
});

// Route - Retrieve specific documents from the database via a complex query.
//         http://localhost:3000/mongo/simplequery
router.get('/simplequery', (request, response) => {
  const log = new hlog.HtmlLog();
  let accountsDb = null;
  let collection = null;
  log.addEntry('<h2>Mongo Test</h2>');
  log.addEntry('<h3>Execution Log:</h3>');
  log.addEntry('Entered /mongo/simplequery...');
  mongoClient.connect(mongoUri)
  .then((db) => {
    accountsDb = db;
    collection = accountsDb.collection('accounts');
    log.addEntry('Successfully connected to MongoDB');
    return collection.count();
  })
  .then((count) => {
    log.addEntry(`Existing record count: ${count}`);
    return collection.find({ owner_fname: { $eq: 'Roger' } });
  })
  .then((cursor) => {
    return cursor.sort({ owner_lname: 1 });
  })
  .then((cursor) => {
    cursor.each((error, anAccount) => {
      if (anAccount === null) {
        log.writeLog('normal', response, 
          'Simplequery test successfully completed');
        return;
      }
      log.addEntry(`Account: account_no:${anAccount.account_no} 
        owner_fname:${anAccount.owner_fname} 
        owner_mi:${anAccount.owner_mi} 
        owner_lname:${anAccount.owner_lname}`);
    });
    accountsDb.close();
  })
  .catch((error) => {
    log.addEntry(`Unable to establish connection to MongoDB. Error: ${error}`);
    log.addEntry(`MongoUri: ${mongoUri}`);
    log.writeLog('error', response);
  });
});

module.exports = router;
