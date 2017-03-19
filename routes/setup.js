// File name: setup.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes responsible for the setup of the test data in the Mongo database.

const config = require('../config');
const express = require('express');
const moment = require('moment');
const mongodb = require('mongodb');
const router = express.Router();

// Establish a mongo connection using settings from the config.js file
// const mongoUri = 'mongodb://' + config.db.host + '/' + config.db.name;
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// HTML Logging Class
// -------------------------------------------------------------
class HtmlLog {
  constructor() {
    this.logEntries = [];
  }
  // Add a new entry to the running log of program events.
  // Prefix each log entry with the current date and time.
  // Returns: N/a
  addEntry(logEntry) {
    console.log(`${this.createTimestamp()} addEntry logEntry:${logEntry}`);
    this.logEntries.push(`<li>${this.createTimestamp()}: ${logEntry}</li>`);
  }
  // Generate a timestamp for the current point in timestamp
  // Returns: String containing the timestamp
  createTimestamp() {
    return moment().format('MM/DD/YY HH:mm:ss.SSS');
  }
  // Write the log to the response object as an HTML list.
  // Returns: N/a
  writeLog(emitType, response) {
    console.log(`${this.createTimestamp()} writeLog emitType:${emitType}`);
    if (emitType === 'normal') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      this.addEntry('Database successfully initialized and loaded.');
    } else {
      response.writeHead(400, { 'Content-Type': 'text/html' });
      this.addEntry('Database initialization and loading failed.');
    }
    const html = this.logEntries.join(' ');
    console.log(`${this.createTimestamp()} html: ${html}`);
    response.write(`<body><div><ul>${html}</ul></div></body>`);
    response.write('End of log');
    response.end();
  }
}

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Populate the database. If it already contains data clear it
//         before reloading.
//         http://localhost:3000/setup/populatedb
router.get('/populatedb', (request, response) => {
  let log = new HtmlLog();
  log.addEntry('Entered /populatedb...');
  const testData = [{
    account_no: 111111,
    owner_fname: 'John',
    owner_mi: 'Q',
    owner_lname: 'Public',
  }, {
    account_no: 111112,
    owner_fname: 'Jane',
    owner_mi: 'I',
    owner_lname: 'Thrify',
  }, {
    account_no: 111114,
    owner_fname: 'Roger',
    owner_mi: 'A',
    owner_lname: 'Johnsen',
  }];
  mongoClient.connect(mongoUri)
  .then((db) => {
    log.addEntry('Successfully connected to MongoDB');
    console.log('Successfully connected to MongoDB');
    const collection = db.collection('accounts');
    collection.count()
    .then((count) => {
      log.addEntry(`count: ${count}`);
      console.log(`current count: ${count}`);
      return collection.remove({});
    })
    .then((removeResult) => {
      log.addEntry(`Records successfully removed. ${removeResult}`);
      console.log(`Records successfully removed. ${removeResult}`);
      return collection.insertMany(testData);
    })
    .then((insertResult) => {
      log.addEntry('Record successfully inserted.');
      console.log(`Record successfully inserted. ${insertResult}`);
      log.writeLog('normal', response);
    });
  })
  .catch((error) => {
    log.addEntry(`Unable to establish connection to MongoDB. Error: ${error}`);
    log.addEntry(`MongoUri: ${mongoUri}`);
    log.writeLog('error', response);
    console.log(`Unable to establish connection to MongoDB. Error: ${error}`);
    console.log(`MongoUri: ${mongoUri}`);
  });
});

module.exports = router;
