// File name: server.js
// Date: 01/29/2017
// Programmer: Jim Medlock
//
// freeCodeCamp Backend Certificate API Project - URL Shortener Microservice

"use strict";
const config = require("../config");
const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();
const UrlSchema = require("../model/urlschema.js");

// Establish a mongo connection using settings from the config.js file
const mongoUri = "mongodb://" + config.db.host + "/" + config.db.name;
const mongoClient = mongodb.MongoClient;

// -------------------------------------------------------------
// Express Route Definitions
// -------------------------------------------------------------
var express = require('express');
var router = express.Router();

// Route - Display the application home page.
//         http://localhost:3000/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
