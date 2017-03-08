// File name: setup.js
// Date: 03/04/2017
// Programmer: Jim Medlock
//
// Routes responsible for the setup of the test data in the Mongo database.

const config = require('../config');
const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();

// Establish a mongo connection using settings from the config.js file
// const mongoUri = 'mongodb://' + config.db.host + '/' + config.db.name;
const mongoUri = `mongodb://${config.db.host}/${config.db.name}`;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------

// Route - Populate the database. If it already contains data clear it
//         before reloading.
//         http://localhost:3000/setup/populatedb
router.get('/populatedb', (request, response) => {
  response.write('Entered /populatedb...');
  const dbRecords = [{
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
    account_no: 111113,
    owner_fname: 'Roger',
    owner_mi: 'A',
    owner_lname: 'Johnsen',
  }];
  mongoClient.connect(mongoUri)
    .then((db) => {
      response.write('\nSuccessfully connected to MongoDB');
      const collection = db.collection('accounts');
      collection.count()
        .then((count) => {
          response.write(`count: ${count}`);
          dbRecords.forEach((element) => {
            collection.insert([element])
              .then((WriteResult) => {
                response.write('\nRecord successfully inserted.');
                response.end();
              })
              .catch((error) => {
                response.json({
                  error: `\nError inserting URL in database. Error: ${error}`,
                });
                response.end();
              });
          });
        })
        .catch((error) => {
          response.write(`\nError retrieving count of accounts. Error: ${error}`);
          response.end();
        });
    })
    .catch((error) => {
      response.write('\nUnable to establish connection to MongoDB', error);
      response.end();
    });
});

module.exports = router;
