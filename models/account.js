// grab the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create the schema for the Account database
const accountSchema = new Schema({
  account_no: { type: Number, required: true, unique: true },
  owner_fname: { type: String, required: true, unique: false },
  owner_mi: { type: String, required: true, unique: false },
  owner_lname: { type: String, required: true, unique: false },
  created_on: { type: Date, required: false, unique: false },
  updated_on: { type: Date, required: false, unique: false },
});

// Create a model for the schema
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
