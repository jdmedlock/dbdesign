// File name: setup.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes responsible for the setup of the test data in the Mongo database.

const config = require('../config');
const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

const hlog = require('../util/htmllog');

// Establish a mongo connection using settings from the config.js file
// const mongoUri = 'mongodb://' + config.db.host + '/' + config.db.name;
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Populate the database. If it already contains data clear it
//         before reloading.
//         http://localhost:3000/setup/initializedb
router.get('/initializedb', (request, response) => {
  const testData = [{
    account_no: 111110,
    owner_fname: 'Roger',
    owner_mi: 'A',
    owner_lname: 'Zelinski',
    created_on: new Date(),
    updated_on: new Date(),
  }, {
    account_no: 111111,
    owner_fname: 'John',
    owner_mi: 'Q',
    owner_lname: 'Public',
    created_on: new Date(),
    updated_on: new Date(),
  }, {
    account_no: 111112,
    owner_fname: 'Jane',
    owner_mi: 'I',
    owner_lname: 'Thrify',
    created_on: new Date(),
    updated_on: new Date(),
  }, {
    account_no: 111113,
    owner_fname: 'Julie',
    owner_mi: 'A',
    owner_lname: 'Greenplante',
    created_on: new Date('10/31/2016'),
    updated_on: new Date('01/05/2017'),
  }, {
    account_no: 111114,
    owner_fname: 'Roger',
    owner_mi: 'A',
    owner_lname: 'Johnsen',
    created_on: new Date('01/01/2017'),
    updated_on: new Date('03/26/2017'),
  }, {
    account_no: 111115,
    owner_fname: 'Roger',
    owner_mi: 'Q',
    owner_lname: 'Public',
    created_on: new Date('03/01/2017'),
    updated_on: new Date('03/27/2017'),
   }, {
    account_no: 111116,
    owner_fname: 'Betty',
    owner_mi: '',
    owner_lname: 'Boop',
    created_on: new Date('03/01/2017'),
    updated_on: new Date('03/24/2017'),
  }, {
    account_no: 111117,
    owner_fname: 'Donald',
    owner_mi: 'F',
    owner_lname: 'Mortgenson',
    created_on: new Date('02/25/2017'),
    updated_on: new Date('03/21/2017'),
  }, {
    account_no: 111118,
    owner_fname: 'Sylvia',
    owner_mi: 'T',
    owner_lname: 'St. John',
    created_on: new Date('12/25/2017'),
    updated_on: new Date('01/01/2017'),
   }, {
    account_no: 111119,
    owner_fname: 'Andrew',
    owner_mi: 'V',
    owner_lname: 'McMasters',
    created_on: new Date('11/02/2016'),
    updated_on: new Date('02/27/2017'),
}];
  const log = new hlog.HtmlLog();
  log.addEntry('<h2>Initialize and Populate Test Database</h2>');
  log.addEntry('<h3>Execution Log:</h3>');
  log.addEntry('Entered /initializedb...');
  mongoClient.connect(mongoUri)
  .then((db) => {
    log.addEntry('Successfully connected to MongoDB');
    const collection = db.collection('accounts');
    collection.count()
    .then((count) => {
      log.addEntry(`Existing record count: ${count}`);
      return collection.remove({});
    })
    .then((removeResult) => {
      log.addEntry(`Records successfully removed. ${removeResult}`);
      return collection.insertMany(testData);
    })
    .then(() => {
      log.addEntry('Records successfully inserted.');
      log.addEntry('Database successfully initialized and loaded');
      db.close();
      log.writeLog('normal', response, 'MongoDB connection closed');
    })
    .catch((error) => {
      log.addEntry(`Error initializing and reloading test data. Error: ${error}`);
      log.writeLog('error', response);
    });
  })
  .catch((error) => {
    log.addEntry(`Unable to establish connection to MongoDB. Error: ${error}`);
    log.addEntry(`MongoUri: ${mongoUri}`);
    log.writeLog('error', response);
  });
});

module.exports = router;
